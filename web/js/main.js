let loading = false;
let ENEM_list = []
let TRASH_list = []
const SIZE = 50;
let score = 0;

const coral_facts = [
    "Коралові рифи ростуть дуже повільно. Великі рифи ростуть зі швидкістю 1-2 см на рік.",
    "Деякі тварини у рифі мають симбіотичні стосунки, допомагаючи один одному вижити.",
    "Різні види коралів утворюють різні форми: гриби, дерева, квіти, мізки.",
    "Великий Бар'єрний риф настільки великий, що його видно з космосу.",
    "Деякі коралові рифи біліють через втрату водоростей при зміні температури води.",
    "Корали є живими організмами, які належать до класу морських безхребетних.",
    "Коралові рифи забезпечують середовище проживання для понад 25% морських видів.",
    "Корали харчуються планктоном і отримують енергію від симбіотичних водоростей.",
    "Коралові рифи допомагають захищати узбережжя від ерозії та штормів.",
    "Деякі корали можуть жити сотні років, а деякі навіть тисячі.",
    "Коралові рифи є важливими для рибальства та туризму в багатьох країнах.",
    "Корали можуть розмножуватися як статевим, так і безстатевим шляхом.",
    "Коралові рифи займають менше 1% океанського дна, але підтримують величезну біорізноманітність.",
    "Корали чутливі до змін температури води, забруднення та підкислення океану.",
    "Деякі види коралів світяться в темряві завдяки флуоресцентним білкам.",
    "Коралові рифи є джерелом нових ліків для лікування хвороб, таких як рак.",
    "Коралові рифи утворюються в тропічних і субтропічних водах з температурою 20-28°C.",
    "Корали можуть утворювати колонії, які розростаються на сотні метрів.",
    "Коралові рифи є одними з найстаріших екосистем на Землі.",
    "Деякі корали можуть змінювати колір залежно від умов навколишнього середовища."
];


const start_game =  async () => {
    create_enemy()
    create_trash()
    await render(ENEM_list,'enemy')
    await render(TRASH_list,'trash')
    loading = true;

}

const render = async (listr,clases) => {
 const list =await listr.map((item) => {
return `<div style="transform:translate(${item.x}px, ${item.y}px" class="${clases}" ></div>`}).join('');
 document.getElementsByClassName('enemy_teretor')[0].innerHTML = document.getElementsByClassName('enemy_teretor')[0].innerHTML +list;
}


function random(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand)
}

const create_enemy = async () => {
    const enem_rect = document.getElementsByClassName('enemy_teretor')[0].getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        let x, y, valid;

        do {
            x = random(50, window.innerWidth - 50);
            y = random(50, enem_rect.height - 80);
            valid = true;

            for (let j = 0; j < ENEM_list.length; j++) {
                if (col_withod(ENEM_list[j], { x, y })) {
                    valid = false;
                    break;
                }
            }
        } while (!valid);

        ENEM_list.push({ x, y });
    }
};

const create_trash = () => {
    const trash_rect = document.getElementsByClassName('enemy_teretor')[0].getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        let x, y, valid;

        do {
            x = random(50, window.innerWidth - 50);
            y = random(50, trash_rect.height - 80);
            valid = true;

            for (let j = 0; j < TRASH_list.length; j++) {
                if (col_withod(TRASH_list[j], { x, y })) {
                    valid = false;
                    break;
                }
            }

            for (let j = 0; j < ENEM_list.length; j++) {
                if (col_withod(ENEM_list[j], { x, y })) {
                    valid = false;
                    break;
                }
            }

        } while (!valid);

        const factIndex = random(0, coral_facts.length - 1);
        const fact = coral_facts.splice(factIndex, 1)[0];
        TRASH_list.push({ x, y, fact });
    }
};


function col(el1, el2) {
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();

    return !(
        r1.right < r2.left || 
        r1.left > r2.right || 
        r1.bottom < r2.top || 
        r1.top > r2.bottom
    );
}

function col_withod(el1, el2) {
    return !(
        el1.x + SIZE < el2.x ||  
        el1.x > el2.x + SIZE ||  
        el1.y + SIZE < el2.y ||  
        el1.y > el2.y + SIZE    
    );
}
const otchet = () =>{ 
    let i=4
    let timw = setInterval(()=>{
        if (i ==0 ) {
            clearInterval(timw);
            document.getElementsByClassName("title_cont")[0].remove();
            document.body.style.backgroundColor= "#4e6879";
            start_game();
        }
        else {
        document.getElementsByClassName("title_cont")[0].classList.add('big')
        i--
        document.getElementsByClassName('wf')[0].textContent =i
        setTimeout(()=>document.getElementsByClassName("title_cont")[0].classList.remove('big'),300)
        
        }
    },800)
} 

function drawCircle(x, y) {
    const canvas = document.getElementById('back_cnv');
    const ctx = canvas.getContext('2d');
    const circles = [];
    const speed = 2000 / 60;
    const maxRadius = 20;

    circles.push({ x, y, radius: 0, growing: true });

    function f(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        circles.forEach((circle, index) => {
            ctx.globalAlpha = 1 - (circle.radius / maxRadius);

            ctx.beginPath();
            ctx.arc(circle.x / 2.6, circle.y / 4, circle.radius, 0, Math.PI * 2);
            ctx.lineWidth = 1;  
            ctx.strokeStyle = '#b3dcfd';  
            ctx.stroke();  
            ctx.closePath();

            if (circle.growing) {
                circle.radius += 0.5;
                if (circle.radius >= maxRadius) {
                    circle.growing = false;
                }
            } else {
                circles.splice(index, 1);
            }
        });

        if (circles.length > 0) {
            requestAnimationFrame(f);
        }
    }

    f();
}

const final = ()=>{
alert("ти виграв,красавчик, я спать")
}

let isclk = false;

const closedf = () => {
    isclk = true; 
    document.getElementsByClassName("modal_cont")[0].style = "display: none";
    document.getElementsByClassName("back")[0].classList.remove("visible");

};


document.addEventListener("DOMContentLoaded", () => {    
    const p = document.getElementsByClassName('player')[0]
    p.style.transform = `translate(${window.innerWidth/2.15}px, ${window.innerHeight-120}px)`;

    otchet();
    setInterval(()=>{
        TRASH_list.forEach((trash, index) => {
            const e_trash = document.getElementsByClassName('trash')[index];
            if (col(p, e_trash)) {
                document.getElementsByClassName("modal_cont")[0].style = "display:flex"
                document.getElementsByClassName("back")[0].classList.add("visible")
                document.getElementById("modal_text").innerText = trash.fact;
                score+=10;
                document.getElementsByClassName("Score")[0].innerText = `Score: ${score}`
                if (score===50) {
                    final();
                }
                e_trash.style.display = "none";


            }
        });
    },1)
});


document.addEventListener("click", (event) => {
    if (isclk) {isclk=false;return}
    if (!loading) return; 

    const player = document.getElementsByClassName('player')[0];
    const playerRect = player.getBoundingClientRect();
    const playerX = playerRect.left + playerRect.width / 2;
    const playerY = playerRect.top + playerRect.height / 2;

    let x = event.clientX - 33;
    let y = event.clientY - 30;

    const ds = Math.sqrt((x - playerX) ** 2 + (y - playerY) ** 2);
    let flip = x > playerX ? "scaleX(-1)" : "scaleX(1)";
    if (ds > 200) {
        awg();
        return;
    }
    drawCircle(playerX, playerY);
    player.style.transform = `translate(${x}px, ${y}px) ${flip}`;
});

const awg = () => {
    const player = document.getElementsByClassName('player')[0];
    player.classList.add("anim");

    setTimeout(() => {
        player.classList.remove("anim");
    }, 350);
};