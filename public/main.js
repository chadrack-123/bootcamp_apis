// public/main.js

function wordsWidget() {
    return {
        sentence: '',
        stats: null,
        analyzeSentence() {
            if (this.sentence.trim() === '') {
                alert('Please enter a sentence.');
                return;
            }
            fetch(`/api/word_game?sentence=${encodeURIComponent(this.sentence)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.stats = data;
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
}

function phoneBillWidget() {
    return {
        billInput: '',
        total: null,
        prices: { call: 2.75, sms: 0.65 },
        newCallPrice: '',
        newSmsPrice: '',
        init() {
            this.getPrices();
        },
        getPrices() {
            fetch('/api/phonebill/prices')
                .then(response => response.json())
                .then(data => {
                    this.prices = data;
                })
                .catch(error => console.error('Error:', error));
        },
        calculateTotal() {
            if (this.billInput.trim() === '') {
                alert('Please enter usage.');
                return;
            }
            fetch('/api/phonebill/total', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bill: this.billInput })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.total = data.total;
                    }
                })
                .catch(error => console.error('Error:', error));
        },
        updatePrices() {
            const updates = [];
            if (this.newCallPrice) {
                updates.push(fetch('/api/phonebill/price', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'call', price: parseFloat(this.newCallPrice) })
                }));
            }
            if (this.newSmsPrice) {
                updates.push(fetch('/api/phonebill/price', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'sms', price: parseFloat(this.newSmsPrice) })
                }));
            }
            Promise.all(updates)
                .then(() => {
                    alert('Prices updated successfully.');
                    this.newCallPrice = '';
                    this.newSmsPrice = '';
                    this.getPrices();
                })
                .catch(error => console.error('Error:', error));
        }
    }
}

function enoughAirtimeWidget() {
    return {
        usage: '',
        available: '',
        result: null,
        checkAirtime() {
            if (this.usage.trim() === '' || this.available === '') {
                alert('Please enter usage and available airtime.');
                return;
            }
            fetch('/api/enough', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usage: this.usage, available: parseFloat(this.available) })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                    } else {
                        this.result = data.result;
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    }
}
