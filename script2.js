const API="https://685204c48612b47a2c0bd9c9.mockapi.io/api/v1/netBalance/";
let apiID = -1;

let reBtn = document.getElementById("resetBtn");

let clBtn = document.getElementById("closeBtn");
clBtn.addEventListener('click', function(){
    formADD.style.display= "none";
})

let filt = document.getElementsByName("filter");
console.log(filt);
filt.forEach(function(filter){
    filter.addEventListener('click', function(event){
        let filterValue = event.target.value;
        fiterLists(filterValue);
    })
})

function fiterLists(filtValue){
    console.log(filtValue);
    let inLi = document.querySelectorAll(".incomeList");
    let exLi = document.querySelectorAll(".expenseList");
    console.log(inLi);
    if(filtValue=="incomeOnly"){
        inLi.forEach((ele)=>ele.classList.remove("show"));
        exLi.forEach((ele)=> ele.classList.add("show"));
    }else if(filtValue=="expenseOnly")
        {
        inLi.forEach((ele)=> ele.classList.add("show"));
        exLi.forEach((ele)=> ele.classList.remove("show"));
    }else{
        inLi.forEach((ele)=> ele.classList.remove("show"));
        exLi.forEach((ele)=> ele.classList.remove("show"));
    }
}

const formADD = document.getElementById("formAdd");
formADD.addEventListener("submit", async (e) =>{
  e.preventDefault();
  const { amount, description, iOe } = e.target;
  const payload = {
    amount: amount.value,
    description: description.value,
    iOe: iOe.value === "income",
  };
  const method = apiID === -1 ? "POST" : "PUT";
  const url = apiID === -1 ? API : API + apiID;

  try {
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    form.style.display = "none";
  } catch (err) {
    console.error("Submission error:", err);
  }
  apiID = -1;
  await mainFunction();
    e.target.amount.value='';
    e.target.description.value='';
    e.target.iOe.value = '';
});

async function fetchExpence(){
    try{
        const fetchExpense = await fetch(API);
        const response=await fetchExpense.json();
        return response;
    }catch(error){
        console.log("ERROR: ",error);
    }
}

async function updateList(iD){
    let resp = await fetch(API+iD);
    let upList = await resp.json();
    console.log(upList);  
    document.getElementsByName("amount")[0].value = Number(upList.amount);
    document.getElementsByName("description")[0].value = upList.description;
    apiID = upList.id;
    formADD.style.display= "grid";
}

function renderList(items = []) {
  apiID = -1;
  let inc = 0, exp = 0;
  const root = document.getElementById("finanList");
  root.innerHTML = `
    <div class="addStyle">
      <button class="addbtn">ADD NEW</button>
    </div>`;

  root.querySelector(".addbtn")
    .addEventListener("click", () => (formADD.style.display = "grid"));

  items.map(({ id, amount, description, iOe }) => {
    const val = parseFloat(amount);
    iOe ? (inc += val) : (exp += val);

    const div = document.createElement("div");
    div.id = id;
    div.className = `${iOe ? "incomeList" : "expenseList"} listStyle`;
    div.style.backgroundColor = iOe ? "rgba(0,255,0,0.2)" : "rgba(255,0,0,0.2)";

    div.innerHTML = `
      <div>${iOe ? "INCOME" : "EXPENSE"}</div>
      <div>$${amount}</div>
      <p>${description}</p>
      <article>
        <button data-id="${id}" data-action="delete">
          <img src="./imgs/delete.png" width="20" height="20">
        </button>
        <button data-id="${id}" data-action="edit">
          <img src="./imgs/pen.png" width="20" height="20">
        </button>
      </article>`;

    root.appendChild(div);
  });

  root.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;
    const { id, action } = btn.dataset;
    if (action === "delete") {
      await fetch(API + id, { method: "DELETE" });
      renderList(await fetchExpence());
    } else if (action === "edit") {
      updateList(id);
    }
  });

  document.getElementById("tIn").textContent = inc.toFixed(2);
  document.getElementById("tEx").textContent = exp.toFixed(2);
  document.getElementById("nBa").textContent = (inc - exp).toFixed(2);
}


async function mainFunction(){
    const money = await fetchExpence();
    renderList(money);
    formADD.style.display= "none";
}

mainFunction()
console.log(API);