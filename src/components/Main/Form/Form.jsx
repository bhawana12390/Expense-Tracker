import React, { useState, useContext, useEffect, useCallback } from "react";
import  { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ExpenseTrackerContext } from "../../../context/context";
import { v4 as uuidv4 } from 'uuid';

import formatDate from "../../../utils/formatDate";
import useStyles from "./styles";
import { incomeCategories, expenseCategories } from "../../../constants/categories";
import { parseRelativeDate } from "../../../utils/parseRelativeDate";
import MicButton from "./button";
import CustomizedSnackbar from "../../Snackbar/Snackbar";

const intialState = {
    amount: '',
    category: '',
    type: 'Income',
    date: formatDate(new Date()),
}

function levenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function fuzzyMatch(input, options, threshold = 0.7) {
    const matches = options.map(option => ({
        option,
        score: 1 - levenshteinDistance(input.toLowerCase(), option.toLowerCase()) / Math.max(input.length, option.length)
    }));

    const bestMatch = matches.reduce((best, current) => (current.score > best.score ? current : best), { score: 0 });

    return bestMatch.score >= threshold ? bestMatch.option : null;
}

const Form = () => {
    const classes = useStyles();
    const [formData, setFormData] = useState(intialState);
    const [open, setOpen] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const { addTransaction } = useContext(ExpenseTrackerContext);
    const [transcript, setTranscript] = useState('');
    const [listening, setListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    // const createTransaction = () => {
    //     const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4()}
    //     addTransaction(transaction);
    //     setFormData(intialState);
    // }

    useEffect(() => {
        setFormKey(prevKey => prevKey+1);
    }, [formData]);
    

    useEffect(() => {
        const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
            let interimTranscript = '';
            for(let i = event.resultIndex; i < event.results.length; ++i){
                if(event.results[i].isFinal) {
                    const finalTranscript = event.results[i][0].transcript.trim();
                    setTranscript(prevTranscript => prevTranscript + finalTranscript + ' ');
                    handleCommand(finalTranscript);
                }
                else{
                    interimTranscript += event.results[i][0].transcript;
                }
            }
        };

        recognitionInstance.onend = () => {
            console.log("Speech recognition ended");
            setListening(false);
        };

        setRecognition(recognitionInstance);
    
        return () => {
                recognitionInstance.stop();
        };
    }, []);

    const handleListen = () => {
        if(listening) {
            recognition.stop();
            setListening(false);
        }
        else{
            recognition.start();
            setListening(true);
            setTranscript('');
        }
    };

    const createTransaction = useCallback(() => {
        setFormData(currentFormData => {
            const transaction = {
                ...currentFormData,
                amount: Number(currentFormData.amount),
                id: uuidv4()
            };
            addTransaction(transaction);
            return intialState;
        });
        
        setTimeout(() => {
            setOpen(true)
        }, 0);
    }, [addTransaction, setOpen]);

    const handleCommand = useCallback((text) => {
        const lowerCaseText = text.toLowerCase();
        console.log("Recieved Text:", lowerCaseText);

        const amountRegex = /(?:amount(?:\s+is)?\s+)?\$?([\d,.]+)(?:\s*dollars?|\s*bucks?|\s*usd)?/i;
        const dateRegex = /(?:on|for|date)\s+(\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}|\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/i;
        const typeRegex = /(income|expense)/;

        const createTransactionRegex = /\b(create|finish|save)\b.*transaction/i;
        const cancelTransactionRegex = /\b(cancel|delete|remove|clear)\b.*transaction/i;
        const setCategoryRegex = /\b(set|change)\b.*category\s+(?:to\s+)?(\w+)/i;
        const addExpenseRegex = /add\s(?:an\s+)?expense/i;
        const addIncomeRegex = /add\s(?:an\s+)?(?:income|balance)/i;

        const allCategories = [...incomeCategories, ...expenseCategories]
            .filter(cat => cat && typeof cat.type === 'string')
            .map(cat => cat.type.toLowerCase());

        const words = lowerCaseText.split(/\s+/);
        const potentialCategory = fuzzyMatch(words[words.length - 1], allCategories);

        const categoryRegex = new RegExp(`(?:category\\s+)?(${allCategories.join('|')})\\b`, 'i');

        // Correction Regex:
        const correctionRegex = /\b(?:i\s+mean|i\s+meant|i\s+said)\b/i;
        const correctedCategoryRegex = new RegExp(`(?:${correctionRegex.source})\\s+(?:the\\s+)?(?:category\\s+(?:is|of)?\\s*)?(${allCategories.join('|')})\\b`, 'i');
        const correctedDateRegex = new RegExp(`(?:${correctionRegex.source})\\s+(?:the\\s+)?(?:date\\s+(?:is|for)?\\s+)?${dateRegex.source}`, 'i');
        const correctedAmountRegex = new RegExp(`(?:${correctionRegex.source})\\s+(?:the\\s+)?(?:amount\\s+(?:is|of)?\\s+)?${amountRegex.source}`, 'i');

        // Transactions:
        if (createTransactionRegex.test(lowerCaseText)) {
            createTransaction();
            return;
        }

        if(cancelTransactionRegex.test(lowerCaseText)) {
            setFormData(intialState);
            return;
        }

        const amountMatch = lowerCaseText.match(amountRegex) || lowerCaseText.match(correctedAmountRegex);
        const categoryMatch = lowerCaseText.match(categoryRegex);
        const dateMatch = lowerCaseText.match(dateRegex) || lowerCaseText.match(correctedDateRegex);
        const typeMatch = lowerCaseText.match(typeRegex);

        const setCategoryMatch = lowerCaseText.match(setCategoryRegex) || lowerCaseText.match(correctedCategoryRegex);

        // console.log('Amount match:', amountMatch);
        // console.log('Category match:', categoryMatch);
        // console.log('Date match:', dateMatch);
        // console.log('Type match:', typeMatch);
        // console.log('Set Category Match:', setCategoryMatch);

        const relativeDateRegex = /(?:on|for|date)\s+(today|tomorrow|next\s+\w+|this\s+\w+) /i;
        const relativeDateMatch = lowerCaseText.match(relativeDateRegex);
        
        setFormData(prevData => {
            const newData = { ...prevData };
            if (amountMatch) {
                const amount = (amountMatch[1] || amountMatch[2] || amountMatch[4] || amountMatch[5]).replace(/,/g, '');
                newData.amount = amount;
            }
            if (potentialCategory) {
                //const categoryValue = (setCategoryMatch && (setCategoryMatch[2] || setCategoryMatch[3])) || categoryMatch[1];
                const matchedCategory = [...incomeCategories, ...expenseCategories]
                    .find(cat => cat && cat.type && cat.type.toLowerCase() === potentialCategory.toLowerCase());
                if(matchedCategory){
                    newData.category = matchedCategory.type;
                }
            }
            if(relativeDateMatch) {
                const parsedDate = parseRelativeDate(relativeDateMatch[1]);
                if(parsedDate) {
                    newData.date = parsedDate;
                }
            }else if (dateMatch) {
                const dateString = dateMatch[1] || dateMatch[3];
                let parsedDate;
            
                if (dateString.includes('/') || dateString.includes('-')) {  
                    parsedDate = new Date(dateString);
                } else {
                    const [day, month, year] = dateString.split(' ');
                    const monthIndex = [
                        'january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december', 
                        'jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                        'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
                    ].findIndex(m => m === month.toLowerCase());
                    
                    if (monthIndex !== -1) {
                        parsedDate = new Date(year, monthIndex, parseInt(day));
                    }
                }
            
                if (parsedDate && !isNaN(parsedDate.getTime())) {
                    newData.date = formatDate(parsedDate);
                } else {
                    console.log("Failed to parse date:", dateString);
                }
            }
            if (setCategoryMatch) {
                const categoryValue = setCategoryMatch[1];
                const matchedCategory = [...incomeCategories, ...expenseCategories]
                    .find(cat => cat && cat.type && cat.type.toLowerCase() === categoryValue.toLowerCase());
                if(matchedCategory) {
                    newData.category = matchedCategory.type;
                }
            }
            
            if (typeMatch) {
                newData.type = typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1);
            }
            else if(addExpenseRegex.test(lowerCaseText)) {
                newData.type = 'Expense';
            }
            else if(addIncomeRegex.test(lowerCaseText)) {
                newData.type = 'Income';
            }
            console.log("Updated formData:", formData);
            return newData;
        });
    }, [createTransaction, incomeCategories, expenseCategories, intialState]); 

    const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories;

    console.log(formData);
    return (
        <div key={formKey}>
            <Grid container spacing={2}>
                <CustomizedSnackbar open={open} setOpen={setOpen} />
                <Grid item xs={12}>
                    <Typography align="center" variant="subtitle2" gutterBottom>
                        {listening && <p>{transcript}</p>}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <MenuItem value="Income">Income</MenuItem>
                            <MenuItem value="Expense">Expense</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            {selectedCategories.map((c) => <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField type="number" label="Amount" fullWidth value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                    <TextField type="date" fullWidth value={formData.date} onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
                </Grid>
                <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>
                    Create
                </Button>
            </Grid>
            <MicButton onClick={handleListen} listening={listening} />
        </div>
    )
}

export default Form;