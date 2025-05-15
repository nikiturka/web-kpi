export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function validatePassword(password) {
    return password.length >= 4;
}

export function validateUsername(username) {
    return username.trim().length >= 3;
}
