prompt("what is your name?");
prompt("what is their name?");

var loveScore = Math.random()*100;
loveScore= Math.floor(loveScore) +1;

if(loveScore> 70 ){
alert("Your love score is " + loveScore + "%" + " You love each other");
}
if(loveScore > 30 && loveScore <= 70){
    alert("Your love score is" + loveScore + "%");
}
if (loveScore<=30){
    alert ("Your love score is "+ loveScore + " You dont get together.")
}


