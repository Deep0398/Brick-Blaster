export function generateUniqueReferenceId(){
    const uniqueId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    return uniqueId;
}