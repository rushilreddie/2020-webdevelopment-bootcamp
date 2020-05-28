var guestList = ["Rushil", "Vamshi","Sumanth", "Mani"];

var guestName = prompt ("What is your name?");

if (guestList.includes(guestName)){
    alert("Welcome");
}else {
    alert ("Sorry you are not in the list");
}