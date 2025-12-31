/**
 * =====================================================
 * DUNGEON WORLD - LADRÃO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_LADRAO = {
    id: "ladrao",
    name: "Ladrão",
    namePlural: "Ladrões",
    description: "Um especialista furtivo em armadilhas, venenos e ataques pelas costas.",
    
    // CARACTERÍSTICAS
    baseHP: 6,
    baseDamage: "d8",
    baseLoad: 9, // 9+FOR
    
    // RAÇAS
    races: [
        {
            id: "halfling",
            name: "Halfling",
            description: "Quando atacar com uma arma de longo alcance, cause dano +2."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Você é um profissional. Quando falar difícil ou discernir realidades com relação a atividades criminosas, receba +1."
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "caotico",
            name: "Caótico",
            description: "Pular sobre o perigo sem um plano."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Evitar ser detectado ou se infiltre um local."
        },
        {
            id: "mal",
            name: "Mal",
            description: "Repassar o perigo ou a culpa para outra pessoa."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "Eu roubei algo de ________________.",
        "________________ estará comigo se algo der errado.",
        "________________ conhece detalhes incriminadores a meu respeito.",
        "________________ e eu estamos fazendo uma falcatrua."
    ],
    
    // SISTEMA DE VENENOS
    poisonSystem: {
        description: "Você se torna um mestre na manipulação e uso de determinado veneno. Escolha uma substância da lista abaixo: ela não será mais considerada perigosa quando você a utilizar. Comece o jogo com 3 doses dela de graça. Sempre que tiver tempo para reunir os materiais e um local adequado para fazer a mistura você pode fazer mais 3 doses do veneno escolhido de graça.",
        applicationNote: "Repare que alguns venenos são aplicados, o que significa que eles devem ser cuidadosamente administrados ao alvo ou a alguma coisa que ele coma ou beba. Venenos de toque só precisam encostar no alvo, e podem ser até mesmo aplicados na lâmina de uma arma.",
        startingDoses: 3,
        poisons: [
            {
                id: "oleo_tagit",
                name: "Óleo de Tagit",
                type: "aplicado",
                effect: "O alvo entra em um estado de sono leve."
            },
            {
                id: "erva_sangrenta",
                name: "Erva Sangrenta",
                type: "toque",
                effect: "O alvo causa -1d4 de dano constante até ser curado."
            },
            {
                id: "raiz_dourada",
                name: "Raiz Dourada",
                type: "aplicado",
                effect: "O alvo trata a próxima criatura que enxergar como um aliado de confiança, até que se prove o contrário."
            },
            {
                id: "lagrimas_serpente",
                name: "Lágrimas de Serpente",
                type: "toque",
                effect: "Qualquer pessoa que causar dano ao alvo rola duas vezes e utiliza o melhor resultado."
            }
        ]
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] },
            { name: "Armadura de couro", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] },
            { name: "3 doses do veneno escolhido", weight: 0, tags: ["ver Envenenador"], fromPoisonChoice: true },
            { name: "10 moedas", weight: 0, tags: [] }
        ],
        choices: [
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "adaga_espada",
                        items: [
                            { name: "Adaga", weight: 1, tags: ["mão", "peso 1"] },
                            { name: "Espada curta", weight: 1, tags: ["corpo a corpo", "peso 1"] }
                        ]
                    },
                    {
                        id: "florete",
                        items: [
                            { name: "Florete", weight: 1, tags: ["corpo a corpo", "preciso", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "arma_distancia",
                title: "Escolha uma arma de longo alcance:",
                options: [
                    {
                        id: "adagas_arremesso",
                        items: [
                            { name: "3 adagas de arremesso", weight: 0, tags: ["arremessável", "próximo", "peso 0"] }
                        ]
                    },
                    {
                        id: "arco_flechas",
                        items: [
                            { name: "Arco desgastado", weight: 2, tags: ["próximo", "peso 2"] },
                            { name: "Fardo de flechas", weight: 1, tags: ["munição 3", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "extra",
                title: "Escolha um:",
                options: [
                    {
                        id: "equipamento_aventureiro",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, tags: ["peso 1"] }
                        ]
                    },
                    {
                        id: "pocao_cura",
                        items: [
                            { name: "Poção de Cura", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "especialista_armadilhas",
            name: "Especialista em Armadilhas",
            trigger: "Quando parar um momento para avaliar uma área perigosa",
            description: "Quando parar um momento para avaliar uma área perigosa, role+DES. Gaste seu domínio enquanto anda pela área para fazer as seguintes perguntas:",
            attribute: "des",
            results: {
                success: "Domínio 3.",
                partial: "Domínio 1."
            },
            hasHoldSystem: true,
            holdName: "domínio",
            holdOptions: [
                "Existe alguma armadilha aqui, e se existir, como ela é ativada?",
                "O que a armadilha faz quando é ativada?",
                "O que mais está escondido por aqui?"
            ],
            required: true
        },
        {
            id: "truques_oficio",
            name: "Truques do Ofício",
            trigger: "Quando arrombar fechaduras, bater carteiras ou desarmar armadilhas",
            description: "Quando arrombar fechaduras, bater carteiras ou desarmar armadilhas, role+DES.",
            attribute: "des",
            results: {
                success: "Você consegue, sem problemas.",
                partial: "Você ainda consegue, mas o MJ lhe oferecerá duas opções entre suspeita, perigo ou preço."
            },
            required: true
        },
        {
            id: "ataque_costas",
            name: "Ataque pelas Costas",
            trigger: "Quando atacar um oponente surpreso ou indefeso com uma arma de combate corpo a corpo",
            description: "Quando atacar um oponente surpreso ou indefeso com uma arma de combate corpo a corpo, você pode optar entre causar dano ou rolar+DES.",
            attribute: "des",
            results: {
                success: "Escolha dois.",
                partial: "Escolha um."
            },
            options: [
                "Você não entra em combate corpo a corpo com o alvo",
                "Você causa seu dano +1d6",
                "Você cria uma situação vantajosa, +1 adiante para si ou para um aliado que consiga agir de acordo",
                "Reduza a armadura do alvo em 1 até que ele consiga repará-la"
            ],
            required: true
        },
        {
            id: "moral_flexivel",
            name: "Moral Flexível",
            description: "Quando alguém tentar detectar seu alinhamento, você pode lhes informar qualquer alinhamento que quiser.",
            required: true
        },
        {
            id: "envenenador",
            name: "Envenenador",
            description: "Você se torna um mestre na manipulação e uso de determinado veneno. Escolha uma substância da lista abaixo: ela não será mais considerada perigosa quando você a utilizar. Comece o jogo com 3 doses dela de graça. Sempre que tiver tempo para reunir os materiais e um local adequado para fazer a mistura você pode fazer mais 3 doses do veneno escolhido de graça. Repare que alguns venenos são aplicados, o que significa que eles devem ser cuidadosamente administrados ao alvo ou a alguma coisa que ele coma ou beba. Venenos de toque só precisam encostar no alvo, e podem ser até mesmo aplicados na lâmina de uma arma.",
            hasPoisonSystem: true,
            poisonOptions: [
                {
                    id: "oleo_tagit",
                    name: "Óleo de Tagit",
                    type: "aplicado",
                    effect: "O alvo entra em um estado de sono leve."
                },
                {
                    id: "erva_sangrenta",
                    name: "Erva Sangrenta",
                    type: "toque",
                    effect: "O alvo causa -1d4 de dano constante até ser curado."
                },
                {
                    id: "raiz_dourada",
                    name: "Raiz Dourada",
                    type: "aplicado",
                    effect: "O alvo trata a próxima criatura que enxergar como um aliado de confiança, até que se prove o contrário."
                },
                {
                    id: "lagrimas_serpente",
                    name: "Lágrimas de Serpente",
                    type: "toque",
                    effect: "Qualquer pessoa que causar dano ao alvo rola duas vezes e utiliza o melhor resultado."
                }
            ],
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "oprimido",
            name: "Oprimido",
            trigger: "Quando estiver em menor número",
            description: "Quando estiver em menor número, receba armadura +1."
        },
        {
            id: "cauteloso",
            name: "Cauteloso",
            trigger: "Quando usar especialista em armadilhas",
            description: "Quando usar especialista em armadilhas, sempre receba domínio +1, mesmo com 6-."
        },
        {
            id: "atirar_primeiro",
            name: "Atirar Primeiro",
            description: "Você nunca é surpreendido. Quando um inimigo surpreendê-lo, você age primeiro."
        },
        {
            id: "golpe_desonesto",
            name: "Golpe Desonesto",
            trigger: "Quando usar uma arma precisa ou de mão",
            description: "Quando usar uma arma precisa ou de mão, seu ataque pelas costas causa +1d6 de dano."
        },
        {
            id: "mestre_venenos",
            name: "Mestre dos Venenos",
            description: "Assim que usar um veneno pela primeira vez, ele não será mais considerado perigoso para você."
        },
        {
            id: "riqueza_bom_gosto",
            name: "Riqueza e Bom Gosto",
            trigger: "Quando fizer uma cena, mostrando a todos sua posse mais valiosa",
            description: "Quando fizer uma cena, mostrando a todos sua posse mais valiosa, escolha alguém presente. Essa pessoa fará qualquer coisa para obter o seu item ou um similar."
        },
        {
            id: "produtor",
            name: "Produtor",
            trigger: "Quando estiver com tempo suficiente para juntar os componentes necessários e um local seguro para preparar",
            description: "Quando estiver com tempo suficiente para juntar os componentes necessários e um local seguro para preparar, você consegue criar 3 doses de qualquer veneno que já tenha usado anteriormente."
        },
        {
            id: "conexoes",
            name: "Conexões",
            trigger: "Quando espalhar pelo submundo rumores a respeito de algo que queira ou precise",
            description: "Quando espalhar pelo submundo rumores a respeito de algo que queira ou precise, role+CAR.",
            attribute: "car",
            results: {
                success: "Alguém tem exatamente o que você precisa.",
                partial: "Ou você terá que se contentar com algo similar, ou ficará de rabo preso – a escolha é sua."
            }
        },
        {
            id: "envenenar",
            name: "Envenenar",
            description: "Você é capaz de aplicar até mesmo os venenos mais complexos com uma tachinha. Quando aplicar em sua arma um veneno que não é perigoso para você, ele é considerado de toque no lugar de aplicado."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "muito_oprimido",
            name: "Muito Oprimido",
            replaces: "Oprimido",
            description: "Receba armadura +1. Quando estiver em menor número, receba armadura +2 no lugar.",
            armorBonus: 1
        },
        {
            id: "lutador_desonesto",
            name: "Lutador Desonesto",
            replaces: "Golpe Desonesto",
            trigger: "Quando usar uma arma precisa ou de mão",
            description: "Quando usar uma arma precisa ou de mão, seu ataque pelas costas causa +1d8 de dano e todos os seus outros ataques causam +1d4 de dano."
        },
        {
            id: "braco_forte_alvo",
            name: "Braço Forte, No Alvo",
            description: "Você é capaz de arremessar qualquer arma branca, utilizando-a para disparar. Uma arma branca arremessada será perdida, logo, você não pode escolher reduzir sua munição com 7–9."
        },
        {
            id: "evasao",
            name: "Evasão",
            trigger: "Quando desafiar o perigo",
            description: "Quando desafiar o perigo, com 12+ você irá transcendê-lo. Não apenas conseguirá realizar seu intento, mas o MJ também lhe oferecerá um resultado melhor, mais belo ou um momento de graça."
        },
        {
            id: "disfarce",
            name: "Disfarce",
            trigger: "Quando tiver tempo e materiais suficientes",
            description: "Quando tiver tempo e materiais suficientes, você pode criar um disfarce capaz de enganar quaisquer observadores, fazendo-os acreditar que você seja outra criatura do mesmo tamanho e forma. Suas ações podem lhe entregar, mas sua aparência não."
        },
        {
            id: "assalto",
            name: "Assalto",
            trigger: "Quando parar para planejar o roubo de alguma coisa",
            description: "Quando parar para planejar o roubo de alguma coisa, diga o que quer roubar e pergunte ao MJ as questões abaixo. Quando agir de acordo com as respostas, você e seus aliados recebem +1 adiante.",
            options: [
                "Quem perceberá a ausência do item roubado?",
                "Qual é a sua defesa mais poderosa?",
                "Quem virá atrás dele?",
                "Quem mais o quer?"
            ]
        },
        {
            id: "rota_fuga",
            name: "Rota de Fuga",
            trigger: "Quando a situação sair do controle e você precisar fugir",
            description: "Quando a situação sair do controle e você precisar fugir, diga qual é sua rota de fuga e role+DES.",
            attribute: "des",
            results: {
                success: "Você vai embora.",
                partial: "Você pode ficar ou partir, mas caso opte por partir, isso irá lhe custar algo: você deixará algo para trás ou levará algo consigo, de acordo com o que o MJ lhe disser."
            }
        },
        {
            id: "alquimista",
            name: "Alquimista",
            replaces: "Produtor",
            trigger: "Quando estiver com tempo suficiente para juntar os componentes necessários e um local seguro para preparar",
            description: "Quando estiver com tempo suficiente para juntar os componentes necessários e um local seguro para preparar, você consegue criar 3 doses de qualquer veneno que já tenha usado anteriormente. Você também pode descrever os efeitos de um veneno qualquer que queira criar. O MJ lhe dirá que é possível criá-lo, porém, com um ou mais das ressalvas abaixo:",
            options: [
                "Ele só funcionará sob determinadas condições",
                "O melhor que você conseguirá fazer é uma versão mais fraca",
                "Seus efeitos demorarão a ocorrer",
                "Ele terá efeitos colaterais óbvios"
            ]
        },
        {
            id: "extremamente_cauteloso",
            name: "Extremamente Cauteloso",
            replaces: "Cauteloso",
            trigger: "Quando usar especialista em armadilhas",
            description: "Quando usar especialista em armadilhas, sempre receba domínio +1, mesmo com 6-. Com 12+, receba domínio 3 e da próxima vez que se aproximar de uma armadilha, o MJ deve imediatamente lhe dizer o que ela faz, o que a dispara, quem a armou ali e como você pode usá-la para seu próprio benefício."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_LADRAO = CLASS_LADRAO;
}
