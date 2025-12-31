/**
 * =====================================================
 * DUNGEON WORLD - BARDO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_BARDO = {
    id: "bardo",
    name: "Bardo",
    namePlural: "Bardos",
    description: "Um artista itinerante que tece magia através de música e histórias.",
    
    // CARACTERÍSTICAS
    baseHP: 6,
    baseDamage: "d6",
    baseLoad: 9, // 9+FOR
    
    // RAÇAS
    races: [
        {
            id: "elfo",
            name: "Elfo",
            description: "Quando entrar em um local importante (decisão do jogador), você pode pedir ao MJ que lhe conte um fato qualquer a respeito da história daquele lugar."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Quando entrar pela primeira vez em um local civilizado, alguém que respeita os costumes de hospitalidade aos menestréis irá recebê-lo como seu convidado."
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "bom",
            name: "Bom",
            description: "Executar sua arte para ajudar alguém."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Evitar um conflito ou desfaça uma situação tensa."
        },
        {
            id: "caotico",
            name: "Caótico",
            description: "Estimular outros a realizarem uma ação decisiva que seja significativa e mal planejada."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "Esta não é minha primeira aventura com ________________.",
        "Já cantei histórias sobre ________________ bem antes de nos conhecermos pessoalmente.",
        "________________ é normalmente o alvo de minhas piadas.",
        "Estou escrevendo uma balada a respeito das aventuras de ________________.",
        "________________ me confidenciou um segredo.",
        "________________ não confia em mim, e com boas razões."
    ],
    
    // CONHECIMENTO DE BARDO - áreas de especialização
    bardLore: {
        description: "Escolha uma área de especialização:",
        options: [
            { id: "magias", name: "Magias e Feitiços" },
            { id: "mortos", name: "Os Mortos e os Mortos-Vivos" },
            { id: "historias", name: "Grandes Histórias do Mundo Conhecido" },
            { id: "bestiario", name: "Um Bestiário de Criaturas Incomuns" },
            { id: "esferas", name: "As Esferas Planares" },
            { id: "herois", name: "Lendas de Heróis do Passado" },
            { id: "deuses", name: "Os Deuses e seus Servos" }
        ]
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] }
        ],
        choices: [
            {
                id: "instrumento",
                title: "Escolha um instrumento (todos possuem peso 0 para você):",
                options: [
                    {
                        id: "bandolim",
                        items: [
                            { name: "O bandolim restaurado de seu pai", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "flauta",
                        items: [
                            { name: "Uma bela flauta, presente de um nobre", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "gaita",
                        items: [
                            { name: "A gaita com a qual cortejou seu primeiro amor", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "corneta",
                        items: [
                            { name: "Uma corneta roubada", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "rabeca",
                        items: [
                            { name: "Uma rabeca que nunca foi tocada", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "livro_cancoes",
                        items: [
                            { name: "Um livro de canções, escrito em uma língua esquecida", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            },
            {
                id: "roupa",
                title: "Escolha sua roupa:",
                options: [
                    {
                        id: "armadura_couro",
                        items: [
                            { name: "Armadura de couro", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] }
                        ]
                    },
                    {
                        id: "roupas_ostensivas",
                        items: [
                            { name: "Roupas ostensivas", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            },
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "florete",
                        items: [
                            { name: "Florete de duelo", weight: 2, tags: ["corpo a corpo", "preciso", "peso 2"] }
                        ]
                    },
                    {
                        id: "arco_espada",
                        items: [
                            { name: "Arco desgastado", weight: 2, tags: ["próximo", "peso 2"] },
                            { name: "Fardo de flechas", weight: 1, tags: ["munição 3", "peso 1"] },
                            { name: "Espada curta", weight: 1, tags: ["corpo a corpo", "peso 1"] }
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
                        id: "bandagens",
                        items: [
                            { name: "Bandagens", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "cachimbo",
                        items: [
                            { name: "Cachimbo Halfling", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "moedas",
                        items: [
                            { name: "3 moedas", weight: 0, tags: [] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "arte_arcana",
            name: "Arte Arcana",
            trigger: "Quando tecer um feitiço básico a partir de uma performance",
            description: "Quando tecer um feitiço básico a partir de uma performance, escolha um aliado e um efeito, e depois role+CAR.",
            attribute: "car",
            results: {
                success: "Com 10+, o aliado recebe o efeito selecionado.",
                partial: "Com 7–9, sua magia funciona, mas você atrai atenção indesejável, ou a sua magia reverbera para outros alvos à escolha do MJ, afetando-os também."
            },
            options: [
                "Curar 1d8 PV",
                "+1d4 adiante para o dano",
                "Remover um encantamento que esteja afetando sua mente",
                "Na próxima vez que alguém Ajudar o alvo, ele receberá +2, e não +1"
            ],
            required: true
        },
        {
            id: "conhecimento_bardo",
            name: "Conhecimento de Bardo",
            description: "Quando encontrar pela primeira vez uma criatura, local ou item importante (decisão do jogador) que esteja ligado ao seu conhecimento de bardo, você pode fazer uma pergunta qualquer ao MJ a respeito daquilo, que ele deve responder honestamente. O MJ pode lhe perguntar qual foi a lenda, canção ou fábula na qual você ouviu tal informação.",
            loreOptions: [
                "Magias e Feitiços",
                "Os Mortos e os Mortos-Vivos",
                "Grandes Histórias do Mundo Conhecido",
                "Um Bestiário de Criaturas Incomuns",
                "As Esferas Planares",
                "Lendas de Heróis do Passado",
                "Os Deuses e seus Servos"
            ],
            required: true
        },
        {
            id: "charmoso_receptivo",
            name: "Charmoso(a) e Receptivo(a)",
            trigger: "Quando conversar francamente com alguém",
            description: "Quando conversar francamente com alguém, você pode fazer ao seu jogador uma pergunta da lista abaixo, que deve ser respondida com honestidade. Aquele jogador então poderá também lhe fazer uma pergunta da lista abaixo (que você também precisa responder honestamente):",
            options: [
                "A quem você serve?",
                "O que você quer que eu faça?",
                "Como faço para conseguir que você ________________?",
                "O que você realmente está sentindo agora?",
                "O que você mais deseja?"
            ],
            required: true
        },
        {
            id: "porto_tempestade",
            name: "Um Porto na Tempestade",
            trigger: "Quando retornar a um local civilizado que já tenha visitado previamente",
            description: "Quando retornar a um local civilizado que já tenha visitado previamente, diga ao MJ quando esteve aqui pela última vez. Ele lhe responderá quais foram as mudanças ocorridas desde aquela época.",
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "pequena_ajuda_amigos",
            name: "Uma Pequena Ajuda de Meus Amigos",
            description: "Quando conseguir ajudar alguém, receba +1 adiante também."
        },
        {
            id: "aparo_duelista",
            name: "Aparo do Duelista",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, receba +1 adiante de armadura."
        },
        {
            id: "cancao_cura",
            name: "Canção da Cura",
            description: "Quando curar usando arte arcana, cure +1d8 de dano."
        },
        {
            id: "cacofonia_violenta",
            name: "Cacofonia Violenta",
            description: "Quando conceder bônus para o dano usando arte arcana, conceda +1d4 de dano extra."
        },
        {
            id: "tons_sobrenaturais",
            name: "Tons Sobrenaturais",
            description: "Sua arte arcana é poderosa, permitindo que escolha dois efeitos no lugar de apenas um."
        },
        {
            id: "mistificar",
            name: "Mistificar",
            trigger: "Quando negociar com um alvo",
            description: "Quando negociar com um alvo, caso obtenha 7+, receba também +1 adiante contra ele."
        },
        {
            id: "amador_multiclasse",
            name: "Amador em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Trate seu nível como se fosse nível -1 no momento da escolha.",
            allowsMulticlass: true
        },
        {
            id: "iniciado_multiclasse",
            name: "Iniciado em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Trate seu nível como se fosse nível -1 no momento da escolha.",
            allowsMulticlass: true
        },
        {
            id: "grito_metalico",
            name: "Grito Metálico",
            trigger: "Quando gritar com muita força ou tocar uma nota devastadora",
            description: "Quando gritar com muita força ou tocar uma nota devastadora, escolha um alvo e role+CON.",
            attribute: "con",
            results: {
                success: "Com 10+, o alvo recebe 1d10 de dano e é ensurdecido por alguns minutos.",
                partial: "Com 7–9, você ainda causa dano ao seu alvo, mas perde o controle, e o MJ escolhe um alvo adicional que esteja próximo."
            }
        },
        {
            id: "volume_maximo",
            name: "Volume Máximo",
            trigger: "Quando desencadear uma performance ensandecida",
            description: "Quando desencadear uma performance ensandecida (um solo de flauta inflamado, uma explosão de tambores de bronze, uma dança interpretativa confusa), escolha um alvo capaz de ouvi-lo e role+CAR.",
            attribute: "car",
            results: {
                success: "Com 10+, o alvo fica confuso e ataca seu aliado mais próximo.",
                partial: "Com 7–9, o alvo ainda ataca seu aliado mais próximo, mas você atrai sua atenção e sua ira."
            }
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "bloqueio_duelista",
            name: "Bloqueio do Duelista",
            replaces: "Aparo do Duelista",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, receba +2 adiante de armadura."
        },
        {
            id: "refrao_cura",
            name: "Refrão da Cura",
            replaces: "Canção da Cura",
            description: "Quando curar usando arte arcana, cure +2d8 de dano."
        },
        {
            id: "explosao_sonora_violenta",
            name: "Explosão Sonora Violenta",
            replaces: "Cacofonia Violenta",
            description: "Quando conceder bônus para o dano usando arte arcana, conceda +2d4 de dano extra."
        },
        {
            id: "acorde_sobrenatural",
            name: "Acorde Sobrenatural",
            replaces: "Tons Sobrenaturais",
            description: "Quando usar arte arcana, escolha dois efeitos no lugar de apenas um. Escolha também um desses dois efeitos para ser aplicado em dobro."
        },
        {
            id: "reputacao",
            name: "Reputação",
            trigger: "Quando encontrar pela primeira vez pessoas que já tenham ouvido canções a seu respeito",
            description: "Quando encontrar pela primeira vez pessoas que já tenham ouvido canções a seu respeito, role+CAR.",
            attribute: "car",
            results: {
                success: "Com 10+, diga ao MJ duas coisas que elas saberiam a seu respeito.",
                partial: "Com 7–9, diga ao MJ uma coisa, e ele dirá outra."
            }
        },
        {
            id: "mestre_multiclasse",
            name: "Mestre em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Trate seu nível como se fosse nível -1 no momento da escolha.",
            allowsMulticlass: true
        },
        {
            id: "rosto_inesquecivel",
            name: "Rosto Inesquecível",
            trigger: "Quando encontrar alguém com quem já tenha se encontrado anteriormente",
            description: "Quando encontrar alguém com quem já tenha se encontrado anteriormente (decisão do jogador) após terem passado algum tempo sem se ver, receba +1 adiante contra essa pessoa."
        },
        {
            id: "ouvido_bom_magia",
            name: "Ouvido Bom para Magia",
            trigger: "Quando ouvir um inimigo conjurar uma magia",
            description: "Quando ouvir um inimigo conjurar uma magia, o MJ lhe dirá qual é o nome da magia e seus efeitos. Receba +1 adiante quando agir de acordo com essas informações."
        },
        {
            id: "desleal",
            name: "Desleal",
            trigger: "Quando for charmoso(a) e receptivo(a)",
            description: "Quando for charmoso(a) e receptivo(a), você também pode perguntar \"Como você seria vulnerável a mim?\". Seu alvo não pode lhe fazer esta pergunta."
        },
        {
            id: "passar_perna",
            name: "Passar a Perna",
            replaces: "Mistificar",
            trigger: "Quando negociar com um alvo",
            description: "Quando negociar com um alvo, com 7+, receba também +1 adiante contra ele e faça ao seu jogador uma pergunta que deve ser respondida honestamente."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_BARDO = CLASS_BARDO;
}
