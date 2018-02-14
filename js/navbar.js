/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "50px";
}

function toggleNav() {
    width = $("#mySidenav").width()
    if (width == 50){
        openNav()
    } else{
        closeNav()
    }
    items = document.getElementsByClassName('my-input');
    for (var i = 0; i < items.length; i++){
        items[i].classList.toggle('show');
    } 
}