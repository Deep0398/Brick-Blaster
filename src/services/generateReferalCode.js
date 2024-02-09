 export  function generateUniqueReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    while (true) {
        let referralCode = '';
        for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            referralCode += characters[randomIndex];
        }
        return  referralCode;
    }
   
}

// Example usage

