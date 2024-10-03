var horario = window.document.getElementById('horario')
var data = new Date()
var hora = data.getHours()

if (hora < 18 || hora >= 23) {
    horario.style.background = "red"
}

const menu = document.getElementById('menu-principal')
const cartbtn = document.getElementById('cart-btn')
const cartmodal = document.getElementById('cart-modal')
const cartitenscontainer = document.getElementById('cart-itens')
const carttotal = document.getElementById('cart-total')
const checkoutbtn = document.getElementById('checkout-btn')
const closemodalbtn = document.getElementById('close-modal-btn')
const cartcouter = document.getElementById('cart-count')
const enderecoinput = document.getElementById('endereco')
const enderecowarn = document.getElementById('endereco-warn')


let cart = []

//abri o modal
cartbtn.addEventListener("click", function(){
    updatecartmodal()
    cartmodal.style.display = "flex"
})

//fecha o modal
cartmodal.addEventListener("click", function(event) {
    if (event.target === cartmodal) {
        cartmodal.style.display = "none"
    }
})

closemodalbtn.addEventListener("click", function() {
    cartmodal.style.display = "none"
})

const addcarrinho = document.getElementById('addcarrinho')

menu.addEventListener("click", function(event) {

    // O 'event' captura o elemento que disparou o evento, ou seja, o botão clicado
    let botaoclicado = event.target.closest(".add-to-cart-btn")

    if (botaoclicado) {
        const produto = botaoclicado.getAttribute("data-nome")
        const preco = Number(botaoclicado.getAttribute("data-preco"))
        addtocart(produto, preco)
    }
    
})

//Função para adicionar no carrinho
function addtocart(produto, preco) {
    const existingitem = cart.find(item => item.produto === produto)

    if(existingitem) {
        //se o item ja existe, aumenta a quantidade + 1
        existingitem.quantidade += 1;
    } else {
        cart.push({
            produto,
            preco,
            quantidade: 1,
        })
    }

    updatecartmodal()
}

function updatecartmodal() {
    cartitenscontainer.innerHTML="";
    let total = 0

    cart.forEach(item => {
        const cartitemelement = document.createElement("div");

        cartitemelement.innerHTML = `
            <div class = "itenscart">
                <div>
                    <p class = "produtocart">${item.produto}</p>
                    <p>Qtd: ${item.quantidade}</p>
                    <p class = "precocart">R$ ${item.preco.toFixed(2)}</p>
                </div>

                <button class = "btnremover" data-nome = "${item.produto}">
                    remover
                </button>
                
            </div>
        `

        total += item.preco * item.quantidade;

        cartitenscontainer.appendChild(cartitemelement)

    })

    carttotal.textContent = total.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})

    cartcouter.innerHTML = cart.length;
}

//Função para remover item do carrinho!
cartitenscontainer.addEventListener("click", function(event) {
    if (event.target.classList.contains("btnremover")) {
        const produto = event.target.getAttribute("data-nome")

        removeitem(produto)
    }
})

function removeitem(produto) {
    const index = cart.findIndex(item => item.produto === produto);

    if (index !== -1) {
        const item = cart[index];
        
        if (item.quantidade > 1) {
            item.quantidade -= 1
            updatecartmodal()
            return
        }

        cart.splice(index, 1)
        updatecartmodal()
    }
}

enderecoinput.addEventListener("input", function(event) {
    let inputvalue = event.target.value

    if (inputvalue !== "") {
        enderecowarn.style.display = "none"
        enderecoinput.style.borderColor = ""
    }

    //
})


checkoutbtn.addEventListener("click", function() {
    //Avisa que a loja esta fechada usar nos projetos!!
    /*const date = new Date()
    const hrs = date.getHours()
    if (hrs < 18 || hrs >= 23) {
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast()

        return;
    }
    */

    if (cart.length === 0) return;
    if (enderecoinput.value === "") {
        enderecowarn.style.display ="flex"
        enderecoinput.style.borderColor="red"
        return;
    }

    //enviar o pedido para api do whatts
    const cartitens = cart.map((item) => {
        return (
            `${item.produto} \nQuantidade: ${item.quantidade} \nPreço: R$${item.preco}\n`+"\n"
        )
    }).join("") 

    const message = encodeURIComponent(cartitens)
    const phone = "98991042408"

    window.open(`https://wa.me/${phone}?text=${message}Endereço: ${enderecoinput.value}`, "_blank")

    cart = []
    updatecartmodal()

})

