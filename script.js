console.log("Meu Controle Financeiro carregado!");


/* =====================================================
   DADOS
===================================================== */

let transacoes = JSON.parse(
    localStorage.getItem("transacoes")
) || [];

let contas = JSON.parse(
    localStorage.getItem("contas")
) || [];

let metas = JSON.parse(
    localStorage.getItem("metas")
) || [];


/* =====================================================
   ELEMENTOS
===================================================== */

const paginas = document.querySelectorAll(".page");
const botoesNavegacao = document.querySelectorAll(".nav-item");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");


/* =====================================================
   NAVEGAÇÃO
===================================================== */

const titulos = {
    inicio: {
        titulo: "Início",
        subtitulo: "Acompanhe sua vida financeira."
    },

    transacoes: {
        titulo: "Entradas e saídas",
        subtitulo: "Controle tudo que entra e sai."
    },

    contas: {
        titulo: "Contas",
        subtitulo: "Acompanhe suas contas e vencimentos."
    },

    metas: {
        titulo: "Metas",
        subtitulo: "Defina objetivos e acompanhe seu progresso."
    }
};


botoesNavegacao.forEach(botao => {

    botao.addEventListener("click", () => {

        const pagina = botao.dataset.page;

        botoesNavegacao.forEach(item => {
            item.classList.remove("active");
        });

        paginas.forEach(item => {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        const paginaAtual = document.getElementById(
            `page-${pagina}`
        );

        if (paginaAtual) {
            paginaAtual.classList.add("active");
        }

        if (titulos[pagina]) {

            pageTitle.textContent =
                titulos[pagina].titulo;

            pageSubtitle.textContent =
                titulos[pagina].subtitulo;
        }

    });

});


/* =====================================================
   FUNÇÕES GERAIS
===================================================== */

function dinheiro(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function gerarId() {

    return Date.now().toString() +
        Math.random().toString(16).slice(2);

}


function salvarDados() {

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );

    localStorage.setItem(
        "contas",
        JSON.stringify(contas)
    );

    localStorage.setItem(
        "metas",
        JSON.stringify(metas)
    );

}


function mostrarToast(mensagem) {

    const toast = document.getElementById("toast");
    const texto = document.getElementById("toastMessage");

    if (!toast || !texto) return;

    texto.textContent = mensagem;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);

}


/* =====================================================
   MODAL TRANSAÇÃO
===================================================== */

const modal = document.getElementById("modal");

const abrirModal = document.getElementById("abrirModal");
const abrirModal2 = document.getElementById("abrirModal2");
const abrirModal3 = document.getElementById("abrirModal3");
const abrirModalTransacoes =
    document.getElementById("abrirModalTransacoes");

const fecharModal =
    document.getElementById("fecharModal");

const cancelarModal =
    document.getElementById("cancelarModal");


function abrirModalTransacao() {

    if (!modal) return;

    modal.classList.add("open");

}


function fecharModalTransacao() {

    if (!modal) return;

    modal.classList.remove("open");

}


if (abrirModal) {
    abrirModal.addEventListener(
        "click",
        abrirModalTransacao
    );
}


if (abrirModal2) {
    abrirModal2.addEventListener(
        "click",
        abrirModalTransacao
    );
}


if (abrirModal3) {
    abrirModal3.addEventListener(
        "click",
        abrirModalTransacao
    );
}


if (abrirModalTransacoes) {
    abrirModalTransacoes.addEventListener(
        "click",
        abrirModalTransacao
    );
}


if (fecharModal) {
    fecharModal.addEventListener(
        "click",
        fecharModalTransacao
    );
}


if (cancelarModal) {
    cancelarModal.addEventListener(
        "click",
        fecharModalTransacao
    );
}


/* fechar modal clicando fora */

if (modal) {

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            fecharModalTransacao();
        }

    });

}


/* =====================================================
   SALVAR TRANSAÇÃO
===================================================== */

const formTransacao =
    document.getElementById("formTransacao");


if (formTransacao) {

    formTransacao.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const tipo =
                document.querySelector(
                    'input[name="tipo"]:checked'
                ).value;

            const descricao =
                document.getElementById("descricao")
                    .value
                    .trim();

            const valor =
                Number(
                    document.getElementById("valor").value
                );

            const data =
                document.getElementById("data").value;

            const categoria =
                document.getElementById("categoria").value;

            const observacao =
                document.getElementById("observacao").value.trim();


            if (!descricao || !valor || !data) {

                mostrarToast(
                    "Preencha os campos obrigatórios."
                );

                return;
            }


            const novaTransacao = {

                id: gerarId(),

                tipo,

                descricao,

                valor,

                data,

                categoria,

                observacao

            };


            transacoes.push(novaTransacao);

            salvarDados();

            renderizarTransacoes();

            atualizarResumo();


            formTransacao.reset();

            document.querySelector(
                'input[name="tipo"][value="entrada"]'
            ).checked = true;


            fecharModalTransacao();

            mostrarToast(
                "Transação adicionada com sucesso!"
            );

        }
    );

}


/* =====================================================
   TRANSAÇÕES
===================================================== */

function formatarData(data) {

    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function renderizarTransacoes() {

    const lista =
        document.getElementById("listaTransacoes");

    const recentes =
        document.getElementById("transacoesRecentes");


    const busca =
        document.getElementById("filtroBusca");

    const tipoFiltro =
        document.getElementById("filtroTipo");


    let listaFiltrada = [...transacoes];


    if (busca) {

        const texto =
            busca.value
                .toLowerCase()
                .trim();

        if (texto) {

            listaFiltrada =
                listaFiltrada.filter(item =>

                    item.descricao
                        .toLowerCase()
                        .includes(texto)

                    ||

                    item.categoria
                        .toLowerCase()
                        .includes(texto)

                );

        }

    }


    if (tipoFiltro && tipoFiltro.value !== "todos") {

        listaFiltrada =
            listaFiltrada.filter(
                item =>
                    item.tipo === tipoFiltro.value
            );

    }


    listaFiltrada.sort(
        (a, b) =>
            new Date(b.data) -
            new Date(a.data)
    );


    /* LISTA PRINCIPAL */

    if (lista) {

        if (listaFiltrada.length === 0) {

            lista.innerHTML = `
                <div class="empty">
                    <div class="empty-icon">📋</div>
                    <h3>Nenhuma transação</h3>
                    <p>Suas transações aparecerão aqui.</p>
                </div>
            `;

        } else {

            lista.innerHTML =
                listaFiltrada
                    .map(criarHTMLTransacao)
                    .join("");

        }

    }


    /* TRANSAÇÕES RECENTES */

    if (recentes) {

        const ultimas =
            [...transacoes]
                .sort(
                    (a, b) =>
                        new Date(b.data) -
                        new Date(a.data)
                )
                .slice(0, 5);


        if (ultimas.length === 0) {

            recentes.innerHTML = `
                <div class="empty">
                    <div class="empty-icon">💰</div>
                    <h3>Nenhuma transação</h3>
                    <p>
                        Adicione sua primeira entrada ou saída.
                    </p>

                    <button
                        class="primary-button"
                        id="abrirModal3"
                    >
                        Adicionar transação
                    </button>
                </div>
            `;


            const novoBotao =
                document.getElementById("abrirModal3");

            if (novoBotao) {

                novoBotao.addEventListener(
                    "click",
                    abrirModalTransacao
                );

            }

        } else {

            recentes.innerHTML =
                ultimas
                    .map(criarHTMLTransacao)
                    .join("");

        }

    }

}


function criarHTMLTransacao(item) {

    const entrada =
        item.tipo === "entrada";


    return `

        <div class="transaction">

            <div class="transaction-icon ${entrada ? "entrada" : "saida"}">

                ${entrada ? "↑" : "↓"}

            </div>


            <div class="transaction-info">

                <strong>
                    ${escaparHTML(item.descricao)}
                </strong>

                <small>
                    ${escaparHTML(item.categoria)}
                    •
                    ${formatarData(item.data)}
                </small>

            </div>


            <div
                class="transaction-value ${entrada ? "green" : "red"}"
            >

                ${entrada ? "+" : "-"}
                ${dinheiro(item.valor)}

            </div>


            <button
                class="delete-button"
                onclick="excluirTransacao('${item.id}')"
                title="Excluir"
            >
                ×
            </button>

        </div>

    `;

}


function excluirTransacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta transação?"
        );

    if (!confirmar) return;


    transacoes =
        transacoes.filter(
            item => item.id !== id
        );


    salvarDados();

    renderizarTransacoes();

    atualizarResumo();

    mostrarToast(
        "Transação excluída."
    );

}


/* filtros */

const filtroBusca =
    document.getElementById("filtroBusca");

const filtroTipo =
    document.getElementById("filtroTipo");


if (filtroBusca) {

    filtroBusca.addEventListener(
        "input",
        renderizarTransacoes
    );

}


if (filtroTipo) {

    filtroTipo.addEventListener(
        "change",
        renderizarTransacoes
    );

}


/* =====================================================
   RESUMO
===================================================== */

function atualizarResumo() {

    let entradas = 0;
    let saidas = 0;


    transacoes.forEach(item => {

        if (item.tipo === "entrada") {

            entradas += Number(item.valor);

        } else {

            saidas += Number(item.valor);

        }

    });


    const saldo =
        entradas - saidas;


    const saldoAtual =
        document.getElementById("saldoAtual");

    const totalEntradas =
        document.getElementById("totalEntradas");

    const totalSaidas =
        document.getElementById("totalSaidas");

    const totalTransacoes =
        document.getElementById("totalTransacoes");


    if (saldoAtual) {

        saldoAtual.textContent =
            dinheiro(saldo);

        saldoAtual.classList.remove(
            "green",
            "red"
        );

        if (saldo < 0) {

            saldoAtual.classList.add("red");

        } else {

            saldoAtual.classList.add("green");

        }

    }


    if (totalEntradas) {

        totalEntradas.textContent =
            dinheiro(entradas);

    }


    if (totalSaidas) {

        totalSaidas.textContent =
            dinheiro(saidas);

    }


    if (totalTransacoes) {

        totalTransacoes.textContent =
            transacoes.length;

    }


    const resumoEntradas =
        document.getElementById("resumoEntradas");

    const resumoSaidas =
        document.getElementById("resumoSaidas");

    const resumoSaldo =
        document.getElementById("resumoSaldo");


    if (resumoEntradas) {

        resumoEntradas.textContent =
            dinheiro(entradas);

    }


    if (resumoSaidas) {

        resumoSaidas.textContent =
            dinheiro(saidas);

    }


    if (resumoSaldo) {

        resumoSaldo.textContent =
            dinheiro(saldo);

        resumoSaldo.classList.remove(
            "green",
            "red"
        );

        resumoSaldo.classList.add(
            saldo < 0 ? "red" : "green"
        );

    }

}


/* =====================================================
   CONTAS
===================================================== */

const abrirConta =
    document.getElementById("abrirConta");

const modalConta =
    document.getElementById("modalConta");

const fecharConta =
    document.getElementById("fecharConta");

const cancelarConta =
    document.getElementById("cancelarConta");


if (abrirConta) {

    abrirConta.addEventListener(
        "click",
        () => {

            modalConta.classList.add("open");

        }
    );

}


if (fecharConta) {

    fecharConta.addEventListener(
        "click",
        () => {

            modalConta.classList.remove("open");

        }
    );

}


if (cancelarConta) {

    cancelarConta.addEventListener(
        "click",
        () => {

            modalConta.classList.remove("open");

        }
    );

}


if (modalConta) {

    modalConta.addEventListener(
        "click",
        event => {

            if (event.target === modalConta) {

                modalConta.classList.remove("open");

            }

        }
    );

}


/* salvar conta */

const formConta =
    document.getElementById("formConta");


if (formConta) {

    formConta.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nome =
                document.getElementById("nomeConta")
                    .value
                    .trim();


            const valor =
                Number(
                    document.getElementById("valorConta")
                        .value
                );


            const vencimento =
                Number(
                    document.getElementById("vencimento")
                        .value
                );


            if (!nome || !valor || !vencimento) {

                mostrarToast(
                    "Preencha todos os campos."
                );

                return;

            }


            contas.push({

                id: gerarId(),

                nome,

                valor,

                vencimento

            });


            salvarDados();

            renderizarContas();


            formConta.reset();

            modalConta.classList.remove(
                "open"
            );


            mostrarToast(
                "Conta adicionada!"
            );

        }
    );

}


/* render contas */

function renderizarContas() {

    const lista =
        document.getElementById("listaContas");


    if (!lista) return;


    if (contas.length === 0) {

        lista.innerHTML = `

            <div class="empty">

                <div class="empty-icon">📄</div>

                <h3>Nenhuma conta cadastrada</h3>

                <p>
                    Cadastre suas contas para não esquecer os vencimentos.
                </p>

            </div>

        `;

        return;

    }


    lista.innerHTML =
        contas
            .map(conta => `

                <div class="account-card">

                    <div class="account-top">

                        <div>

                            <h3>
                                ${escaparHTML(conta.nome)}
                            </h3>

                            <small>
                                Conta cadastrada
                            </small>

                        </div>

                        <button
                            class="delete-button"
                            onclick="excluirConta('${conta.id}')"
                        >
                            ×
                        </button>

                    </div>


                    <div class="account-value">

                        ${dinheiro(conta.valor)}

                    </div>


                    <div class="account-due">

                        Vencimento:
                        dia ${conta.vencimento}

                    </div>

                </div>

            `)
            .join("");

}


function excluirConta(id) {

    if (
        !confirm(
            "Deseja excluir esta conta?"
        )
    ) return;


    contas =
        contas.filter(
            conta => conta.id !== id
        );


    salvarDados();

    renderizarContas();

    mostrarToast(
        "Conta excluída."
    );

}


/* =====================================================
   METAS
===================================================== */

const abrirMeta =
    document.getElementById("abrirMeta");

const modalMeta =
    document.getElementById("modalMeta");

const fecharMeta =
    document.getElementById("fecharMeta");

const cancelarMeta =
    document.getElementById("cancelarMeta");


if (abrirMeta) {

    abrirMeta.addEventListener(
        "click",
        () => {

            modalMeta.classList.add("open");

        }
    );

}


if (fecharMeta) {

    fecharMeta.addEventListener(
        "click",
        () => {

            modalMeta.classList.remove("open");

        }
    );

}


if (cancelarMeta) {

    cancelarMeta.addEventListener(
        "click",
        () => {

            modalMeta.classList.remove("open");

        }
    );

}


if (modalMeta) {

    modalMeta.addEventListener(
        "click",
        event => {

            if (event.target === modalMeta) {

                modalMeta.classList.remove(
                    "open"
                );

            }

        }
    );

}


/* salvar meta */

const formMeta =
    document.getElementById("formMeta");


if (formMeta) {

    formMeta.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const nome =
                document.getElementById("nomeMeta")
                    .value
                    .trim();


            const valor =
                Number(
                    document.getElementById("valorMeta")
                        .value
                );


            const guardado =
                Number(
                    document.getElementById("guardadoMeta")
                        .value
                ) || 0;


            if (!nome || !valor) {

                mostrarToast(
                    "Preencha os campos obrigatórios."
                );

                return;

            }


            metas.push({

                id: gerarId(),

                nome,

                valor,

                guardado

            });


            salvarDados();

            renderizarMetas();


            formMeta.reset();


            document.getElementById(
                "guardadoMeta"
            ).value = 0;


            modalMeta.classList.remove(
                "open"
            );


            mostrarToast(
                "Meta adicionada!"
            );

        }
    );

}


/* render metas */

function renderizarMetas() {

    const lista =
        document.getElementById("listaMetas");


    if (!lista) return;


    if (metas.length === 0) {

        lista.innerHTML = `

            <div class="empty">

                <div class="empty-icon">🎯</div>

                <h3>Nenhuma meta cadastrada</h3>

                <p>
                    Crie uma meta para começar a guardar dinheiro.
                </p>

            </div>

        `;

        return;

    }


    lista.innerHTML =
        metas
            .map(meta => {

                const porcentagem =
                    Math.min(
                        (meta.guardado / meta.valor) * 100,
                        100
                    );


                return `

                    <div class="goal-card">

                        <div class="goal-top">

                            <div>

                                <h3>
                                    ${escaparHTML(meta.nome)}
                                </h3>

                                <small>
                                    Meta financeira
                                </small>

                            </div>


                            <button
                                class="delete-button"
                                onclick="excluirMeta('${meta.id}')"
                            >
                                ×
                            </button>

                        </div>


                        <div class="goal-value">

                            ${dinheiro(meta.guardado)}

                            <small>
                                de ${dinheiro(meta.valor)}
                            </small>

                        </div>


                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width: ${porcentagem}%"
                            ></div>

                        </div>


                        <div class="progress-text">

                            <span>
                                ${porcentagem.toFixed(0)}%
                            </span>

                            <span>
                                ${dinheiro(
                                    Math.max(
                                        meta.valor -
                                        meta.guardado,
                                        0
                                    )
                                )}
                                restantes
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");

}


function excluirMeta(id) {

    if (
        !confirm(
            "Deseja excluir esta meta?"
        )
    ) return;


    metas =
        metas.filter(
            meta => meta.id !== id
        );


    salvarDados();

    renderizarMetas();

    mostrarToast(
        "Meta excluída."
    );

}


/* =====================================================
   SEGURANÇA DO TEXTO
===================================================== */

function escaparHTML(texto) {

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   LIMPAR DADOS
===================================================== */

const limparDados =
    document.getElementById("limparDados");


if (limparDados) {

    limparDados.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "Isso vai apagar todas as transações, contas e metas. Deseja continuar?"
                );


            if (!confirmar) return;


            transacoes = [];
            contas = [];
            metas = [];


            localStorage.removeItem(
                "transacoes"
            );

            localStorage.removeItem(
                "contas"
            );

            localStorage.removeItem(
                "metas"
            );


            renderizarTransacoes();

            renderizarContas();

            renderizarMetas();

            atualizarResumo();


            mostrarToast(
                "Todos os dados foram apagados."
            );

        }
    );

}


/* =====================================================
   DATA AUTOMÁTICA
===================================================== */

const campoData =
    document.getElementById("data");


if (campoData) {

    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];

    campoData.value = hoje;

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

renderizarTransacoes();

renderizarContas();

renderizarMetas();

atualizarResumo();

console.log("Aplicativo inicializado com sucesso.");