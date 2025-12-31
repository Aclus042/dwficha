/**
 * =====================================================
 * DUNGEON WORLD - PALADINO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_PALADINO = {
    id: "paladino",
    name: "Paladino",
    namePlural: "Paladinos",
    description: "Um cavaleiro sagrado em busca de uma missão divina, guiado por votos e dádivas.",
    
    // CARACTERÍSTICAS
    baseHP: 10,
    baseDamage: "d10",
    baseLoad: 12, // 12+FOR
    
    // RAÇAS - Paladino é sempre humano
    races: [
        {
            id: "humano",
            name: "Humano",
            description: "Quando fizer uma oração, pedindo à sua divindade que o guie, mesmo que por um momento, e perguntar \"O que é maligno aqui?\", o MJ lhe responderá honestamente."
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "ordeiro",
            name: "Ordeiro",
            description: "Negar misericórdia a um criminoso ou infiel."
        },
        {
            id: "bom",
            name: "Bom",
            description: "Colocar-se em perigo para proteger alguém mais fraco."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "O comportamento inadequado de ________________ coloca em risco sua própria alma!",
        "________________ já batalhou ao meu lado e tem minha total confiança.",
        "Eu respeito as crenças de ________________, mas espero que ele(a) enxergue a verdade um dia.",
        "________________ é uma alma corajosa, uma pessoa com a qual tenho muito o que aprender."
    ],
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] },
            { name: "Armadura de escamas", weight: 3, armor: 2, tags: ["armadura 2", "peso 3"] },
            { name: "Objeto de sua fé", weight: 0, tags: ["peso 0"], customizable: true, customNote: "descreva-o" }
        ],
        choices: [
            {
                id: "arma",
                title: "Escolha sua arma:",
                options: [
                    {
                        id: "alabarda",
                        items: [
                            { name: "Alabarda", weight: 2, tags: ["alcance", "dano +1", "duas mãos", "peso 2"] }
                        ]
                    },
                    {
                        id: "espada_escudo",
                        items: [
                            { name: "Espada longa", weight: 1, tags: ["corpo a corpo", "dano +1", "peso 1"] },
                            { name: "Escudo", weight: 2, armor: 1, tags: ["armadura +1", "peso 2"] }
                        ]
                    }
                ]
            },
            {
                id: "item_extra",
                title: "Escolha um:",
                options: [
                    {
                        id: "equipamento_aventureiro",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, tags: ["peso 1"] }
                        ]
                    },
                    {
                        id: "racoes_pocao",
                        items: [
                            { name: "Rações de masmorra", weight: 1, tags: ["peso 1"] },
                            { name: "Poção de cura", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // SISTEMA DE BUSCA SAGRADA
    quest: {
        description: "Quando você se dedicar a uma missão através da oração e da purificação espiritual, diga o que pretende fazer:",
        questOptions: [
            "Destruir ________________, um terrível mal que se abate sobre a terra",
            "Defender ________________ dos males que lhe afligem",
            "Descobrir a verdade a respeito de ________________"
        ],
        giftNote: "Depois, escolha duas dádivas:",
        gifts: [
            "Um senso de direção infalível que me aponta para ________________",
            "Invulnerabilidade contra ________________ (por exemplo, armas afiadas, fogo, encantamentos, etc.)",
            "Uma marca de autoridade divina",
            "Sentidos que atravessem qualquer mentira",
            "Uma voz que transcenda a linguagem",
            "Ver-se livre da fome, sede e sono"
        ],
        vowNote: "O MJ lhe dirá qual voto ou quais votos deverão ser mantidos para que essas dádivas lhe sejam concedidas:",
        vows: [
            { id: "honra", name: "Honra", restriction: "proibido: truques e táticas covardes" },
            { id: "temperanca", name: "Temperança", restriction: "proibido: comilança, bebedeira e os prazeres da carne" },
            { id: "piedade", name: "Piedade", restriction: "requer: realizar seus rituais sagrados diariamente" },
            { id: "valor", name: "Valor", restriction: "proibido: permitir que uma criatura maligna viva" },
            { id: "verdade", name: "Verdade", restriction: "proibido: mentiras" },
            { id: "hospitalidade", name: "Hospitalidade", restriction: "requer: dar conforto àqueles que necessitem, não importa quem sejam" }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "impor_maos",
            name: "Impor as Mãos",
            trigger: "Quando tocar alguém, pele com pele, e rezar por seu bem estar",
            description: "Quando tocar alguém, pele com pele, e rezar por seu bem estar, role+CAR.",
            attribute: "car",
            results: {
                success: "Você cura 1d8 de dano ou remove uma doença.",
                partial: "A cura acontece, mas o dano ou a doença é transferido para você."
            },
            required: true
        },
        {
            id: "fortificado",
            name: "Fortificado",
            description: "Ignore o rótulo \"desajeitada\" em qualquer armadura que você usar.",
            required: true
        },
        {
            id: "eu_sou_a_lei",
            name: "Eu Sou a Lei",
            trigger: "Quando der uma ordem a um PNJ baseado em sua autoridade divina",
            description: "Quando der uma ordem a um PNJ baseado em sua autoridade divina, role+CAR.",
            attribute: "car",
            results: {
                success: "Ele escolhe uma das opções abaixo, e você também recebe +1 adiante contra o PNJ.",
                partial: "Ele escolhe uma das opções abaixo.",
                fail: "O alvo faz o que bem entender, e você recebe -1 adiante contra ele."
            },
            options: [
                "Faz o que foi mandado",
                "Recua cuidadosamente, depois foge",
                "Ataca você"
            ],
            required: true
        },
        {
            id: "busca",
            name: "Busca",
            trigger: "Quando você se dedicar a uma missão através da oração e da purificação espiritual",
            description: "Quando você se dedicar a uma missão através da oração e da purificação espiritual, diga o que pretende fazer.",
            hasQuestBuilder: true,
            questBuilderNote: "Configure sua busca sagrada na seção dedicada abaixo.",
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "voz_autoridade",
            name: "Voz de Autoridade",
            description: "Você recebe +1 para comandar servos."
        },
        {
            id: "hospitaleiro",
            name: "Hospitalário",
            trigger: "Quando curar um aliado",
            description: "Quando curar um aliado, cure +1d8 de dano."
        },
        {
            id: "punicao",
            name: "Punição",
            description: "Enquanto estiver em uma busca, você causará +1d4 de dano."
        },
        {
            id: "protecao_sagrada",
            name: "Proteção Sagrada",
            description: "Você recebe armadura +1 enquanto estiver em uma busca."
        },
        {
            id: "defensor_convicto",
            name: "Defensor Convicto",
            trigger: "Quando defender",
            description: "Quando defender, você sempre recebe +1 domínio, mesmo com 6-."
        },
        {
            id: "investir",
            name: "Investir!",
            trigger: "Quando liderar a investida rumo ao combate",
            description: "Quando liderar a investida rumo ao combate, aqueles que o seguirem recebem +1 adiante."
        },
        {
            id: "preparar_ataque",
            name: "Preparar Ataque",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, escolha um aliado. O próximo ataque que ele realizar contra o seu alvo causará +1d4 de dano."
        },
        {
            id: "protecao_sangrenta",
            name: "Proteção Sangrenta",
            description: "Sempre que receber dano, você pode cerrar os dentes e aceitar o golpe. Se o fizer, você não recebe dano, mas adquire uma debilidade de sua escolha. Caso já possua todas as seis debilidades, você não poderá usar este movimento."
        },
        {
            id: "exterminatus",
            name: "Exterminatus",
            trigger: "Quando pronunciar em voz alta sua promessa de derrotar um inimigo",
            description: "Quando pronunciar em voz alta sua promessa de derrotar um inimigo, você causará +2d4 de dano contra ele, e -4 de dano contra todos os outros. Este efeito persiste até que o inimigo declarado seja derrotado. Caso não seja capaz de vencê-lo ou desista da luta, você pode admitir o fracasso, mas este efeito não se encerrará até que você consiga se redimir."
        },
        {
            id: "favor_divino",
            name: "Favor Divino",
            description: "Dedique-se a uma divindade (crie uma nova, ou escolha uma que já foi estabelecida anteriormente). Você recebe os movimentos de clérigo comungar e conjurar feitiços. Assim que escolher este movimento, seu personagem será considerado um clérigo de nível 1 para a utilização de feitiços. A partir desse momento, sempre que ganhar um novo nível, aumente seu nível efetivo de clérigo em 1.",
            grantsClericSpells: true,
            grantsClericMoves: ['comungar', 'conjurar_feiticos']
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "hospitaleiro_perfeito",
            name: "Hospitaleiro Perfeito",
            replaces: "Hospitalário",
            trigger: "Quando curar um aliado",
            description: "Quando curar um aliado, cure +2d8 de dano."
        },
        {
            id: "punicao_divina",
            name: "Punição Divina",
            replaces: "Punição",
            description: "Enquanto estiver em uma busca, você causa +1d8 de dano."
        },
        {
            id: "protecao_divina",
            name: "Proteção Divina",
            replaces: "Proteção Sagrada",
            description: "Você recebe armadura +2 enquanto estiver em uma busca."
        },
        {
            id: "cavaleiro_perfeito",
            name: "Cavaleiro Perfeito",
            trigger: "Quando iniciar uma busca",
            description: "Quando iniciar uma busca, escolha três dádivas no lugar de duas."
        },
        {
            id: "indomavel",
            name: "Indomável",
            trigger: "Quando sofrer uma debilidade (mesmo as originadas de Proteção Sangrenta)",
            description: "Quando sofrer uma debilidade (mesmo as originadas de Proteção Sangrenta), receba +1 adiante contra quem a tenha causado."
        },
        {
            id: "sempre_em_frente",
            name: "Sempre em Frente",
            replaces: "Investir!",
            trigger: "Quando liderar a investida rumo ao combate",
            description: "Quando liderar a investida rumo ao combate, aqueles que o seguirem recebem +1 adiante e armadura +2 adiante."
        },
        {
            id: "ataque_sequencia",
            name: "Ataque em Sequência",
            replaces: "Preparar Ataque",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, escolha um aliado. Além de causar +1d4 de dano no próximo ataque contra o mesmo alvo, seu aliado receberá +1 adiante contra ele."
        },
        {
            id: "autoridade_divina",
            name: "Autoridade Divina",
            replaces: "Voz de Autoridade",
            description: "Você recebe +1 para comandar servos. Com 12+, o subordinado transcende seu momento de medo e dúvida e faz o que você mandar com elevada efetividade e eficiência."
        },
        {
            id: "prova_fe",
            name: "Prova de Fé",
            requires: "Favor Divino",
            trigger: "Quando observar a conjuração de um feitiço divino",
            description: "Quando observar a conjuração de um feitiço divino, você pode perguntar ao MJ qual divindade o concedeu, e quais são seus efeitos. Receba +1 adiante se agir de acordo com as respostas."
        },
        {
            id: "defensor_intransponivel",
            name: "Defensor Intransponível",
            replaces: "Defensor Convicto",
            trigger: "Quando defender",
            description: "Quando defender, você sempre recebe +1 domínio, mesmo com 6-. Se rolar 12+, no lugar de obter domínio, coloque-se no caminho da criatura atacante mais próxima. Você receberá uma vantagem clara contra ela, que será descrita pelo MJ."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_PALADINO = CLASS_PALADINO;
}
