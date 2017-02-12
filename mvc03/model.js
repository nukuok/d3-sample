var models = [
    {servername: "server1", x: 100, y: 100, transform: {x:0, y:0}, r: 30},
    {servername: "server2", x: 200, y: 100, transform: {x:0, y:0}, r: 30},
    {servername: "server3", x: 100, y: 200, transform: {x:0, y:0}, r: 30},
    {servername: "server4", x: 200, y: 200, transform: {x:0, y:0}, r: 30},
]

// function model1 (){
//     this.x = 100;
//     this.y = 100;
//     this.transform = {x:0, y:0}
//     this.r = 30;
// }

function model1(gname){
    this.models = models;
    this.gname = gname;
}
