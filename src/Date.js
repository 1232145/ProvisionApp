/**
* Get the current date in a string format: m/d/y h-m
* @returns a string representation of current time
*/
const getDate = () => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();
    return `${month}/${day}/${year} ${d.toTimeString().slice(0, 5)}`;
}

/**
 * Get the current time in a string format: h-m
 * @returns a string representation of current time
 */
const getTime = () => {
    let date = getDate();
    return date.slice(10, 15);
}

export default {getDate, getTime};