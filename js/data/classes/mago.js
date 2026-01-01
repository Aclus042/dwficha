/**
 * =====================================================
 * DUNGEON WORLD - MAGO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_MAGO = {
    id: "mago",
    name: "Mago",
    namePlural: "Magos",
    description: "Um estudioso das artes arcanas que conjura feitiços poderosos através de seu grimório.",
    
    // CARACTERÍSTICAS
    baseHP: 4,
    baseDamage: "d4",
    baseLoad: 7, // 7+FOR
    
    // RAÇAS
    races: [
        {
            id: "elfo",
            name: "Elfo",
            description: "A magia lhe é tão natural quanto o ato de respirar. Detectar Magia é considerada um truque para você."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Escolha um feitiço de clérigo. Você pode conjurá-lo como se fosse um feitiço de mago.",
            requiresClericSpellChoice: true
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "bom",
            name: "Bom",
            description: "Usar magia para ajudar diretamente outra pessoa."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Descobrir informações a respeito de um enigma ou mistério mágico."
        },
        {
            id: "mal",
            name: "Mal",
            description: "Usar magia para causar medo e terror."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "________________ terá um importante papel a desempenhar em eventos vindouros. Assim dizem minhas previsões!",
        "________________ está escondendo de mim um importante segredo.",
        "________________ é totalmente ignorante sobre o funcionamento deste mundo. Eu lhe ensinarei tudo o que puder."
    ],
    
    // SISTEMA DE MAGIA
    spellcasting: {
        attribute: "int",
        type: "prepared",
        grimoireWeight: 1,
        preparedSpellsFormula: "nível + 1",
        startingSpells: 3,
        startingSpellLevel: 1,
        cantripsAlwaysPrepared: true,
        spellsSource: "mago-spells"
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Grimório", weight: 1, tags: ["peso 1"], isGrimoire: true },
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] }
        ],
        choices: [
            {
                id: "defesa",
                title: "Escolha suas defesas:",
                options: [
                    {
                        id: "armadura_couro",
                        items: [
                            { name: "Armadura de couro", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] }
                        ]
                    },
                    {
                        id: "livros_pocoes",
                        items: [
                            { name: "Bolsa de livros", weight: 2, tags: ["5 usos", "peso 2"] },
                            { name: "3 poções de cura", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            },
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "adaga",
                        items: [
                            { name: "Adaga", weight: 1, tags: ["mão", "peso 1"] }
                        ]
                    },
                    {
                        id: "cajado",
                        items: [
                            { name: "Cajado", weight: 1, tags: ["corpo a corpo", "duas mãos", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "item_final",
                title: "Escolha um:",
                options: [
                    {
                        id: "pocao_cura",
                        items: [
                            { name: "Poção de cura", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "antitoxinas",
                        items: [
                            { name: "Três antitoxinas", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "grimorio",
            name: "Grimório",
            description: "Você aprendeu diversos feitiços e os inscreveu em seu grimório. Comece o jogo com 3 feitiços de primeiro nível anotados em seu livro, assim como todos os truques. Sempre que ganhar um nível, adicione ao seu grimório um feitiço de nível igual ou inferior ao seu. O livro possui peso 1.",
            hasGrimoireSystem: true,
            required: true
        },
        {
            id: "preparar_feiticos",
            name: "Preparar Feitiços",
            trigger: "Quando passar algum tempo contemplando silenciosamente seu grimório (uma hora, aproximadamente) sem interrupções",
            description: "Quando passar algum tempo contemplando silenciosamente seu grimório (uma hora, aproximadamente) sem interrupções, você:",
            bulletPoints: [
                "Perde todos os feitiços que havia preparado anteriormente",
                "Prepara novos feitiços que estejam anotados em seu grimório à sua escolha, cujo total de níveis não supere seu próprio nível + 1",
                "Prepara todos os seus truques, que nunca contam para o limite acima."
            ],
            hasPreparedSpellsSystem: true,
            required: true
        },
        {
            id: "conjurar_feiticos",
            name: "Conjurar Feitiços",
            trigger: "Quando lançar um feitiço preparado",
            description: "Quando lançar um feitiço preparado, role+INT.",
            attribute: "int",
            results: {
                success: "O feitiço é conjurado com sucesso e não é esquecido – logo, você poderá conjurá-lo novamente mais tarde.",
                partial: "O feitiço é conjurado, mas escolha um:"
            },
            options: [
                "Você atrai atenção indesejável ou se coloca em alguma situação complicada. O MJ descreverá como.",
                "Sua conjuração perturba a trama da realidade – receba -1 constante para conjurar feitiços até a próxima vez que você Preparar Feitiços.",
                "Você esquece o feitiço após conjurá-lo, e não conseguirá conjurá-lo de novo até a próxima vez que preparar feitiços."
            ],
            spellNote: "Repare que manter ativos feitiços com efeitos contínuos pode lhe ocasionar uma penalidade na rolagem de conjurar feitiços.",
            required: true
        },
        {
            id: "ritual",
            name: "Ritual",
            trigger: "Quando drenar energia de um local de poder para criar um efeito mágico",
            description: "Quando drenar energia de um local de poder para criar um efeito mágico, diga ao MJ o que está tentando realizar. Efeitos advindos de rituais são sempre possíveis, mas o MJ lhe dará de uma a quatro das condições abaixo:",
            hasRitualConditions: true,
            ritualConditions: [
                { text: "O ritual vai demorar dias/semanas/meses" },
                { text: "Primeiro você tem que ________________" },
                { text: "Você precisará da ajuda de ________________" },
                { text: "O ritual vai requerer uma enorme quantia em dinheiro" },
                { text: "O melhor que consegue fazer é uma versão inferior, pouco confiável e limitada" },
                { text: "Você e seus aliados correrão o perigo de ________________" },
                { text: "Você precisará desencantar ________________ para fazê-lo" }
            ],
            required: true
        },
        {
            id: "defesa_magica",
            name: "Defesa Mágica",
            description: "Você pode desfazer um feitiço contínuo imediatamente, e utilizar a energia envolvida em sua dissipação para defletir um ataque. O feitiço é encerrado e você subtrai o nível dele do dano recebido.",
            required: true            
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "grimorio_expandido",
            name: "Grimório Expandido",
            description: "Adicione um feitiço novo de qualquer outra classe ao seu grimório.",
            allowsSpellFromOtherClass: true,
            spellSource: "clerigo"
        },
        {
            id: "prodigio",
            name: "Prodígio",
            description: "Você pode preparar um feitiço de um círculo acima do seu nível atual."
        },
        {
            id: "fonte_conhecimento",
            name: "Fonte de Conhecimento",
            trigger: "Quando falar difícil a respeito de alguma coisa que ninguém mais saiba",
            description: "Quando falar difícil a respeito de alguma coisa que ninguém mais saiba, receba +1."
        },
        {
            id: "protecao_arcana",
            name: "Proteção Arcana",
            description: "Enquanto estiver com pelo menos um feitiço de nível 1 ou superior preparado, você recebe armadura +2."
        },
        {
            id: "logica",
            name: "Lógica",
            trigger: "Quando utilizar seu poder de dedução para analisar os arredores",
            description: "Quando utilizar seu poder de dedução para analisar os arredores, você pode discernir realidades com INT no lugar de SAB."
        },
        {
            id: "encantador",
            name: "Encantador",
            trigger: "Quando puder passar um tempo estudando um item mágico em um local seguro",
            description: "Quando puder passar um tempo estudando um item mágico em um local seguro, pergunte ao MJ o que ele faz. Ele responderá honestamente."
        },
        {
            id: "estudar_rapidamente",
            name: "Estudar Rapidamente",
            trigger: "Quando observar os efeitos de um feitiço arcano",
            description: "Quando observar os efeitos de um feitiço arcano, pergunte ao MJ seu nome e quais são os seus efeitos. Você recebe +1 adiante quando agir de acordo com a resposta."
        },
        {
            id: "sabe_tudo",
            name: "Sabe-Tudo",
            trigger: "Quando o personagem de outro jogador lhe pedir conselhos",
            description: "Quando o personagem de outro jogador lhe pedir conselhos, você lhe disser qual considera ser a melhor solução e ele seguir seu conselho, ele receberá +1 adiante e você marcará XP."
        },
        {
            id: "contramagica",
            name: "Contramágica",
            trigger: "Quando tentar conter um feitiço arcano que iria lhe afetar",
            description: "Quando tentar conter um feitiço arcano que iria lhe afetar, comprometa um de seus feitiços preparados na defesa e role+INT.",
            attribute: "int",
            results: {
                success: "O feitiço é contido e não lhe afeta.",
                partial: "O feitiço é contido e você esquece o feitiço comprometido."
            },
            spellNote: "Sua contramágica protege apenas você – caso o feitiço contido tenha outros alvos, eles serão afetados normalmente."
        },
        {
            id: "magia_potencializada",
            name: "Magia Potencializada",
            trigger: "Quando conjurar feitiços",
            description: "Quando conjurar feitiços, com 10+ você tem a opção de escolher um item da lista de 7–9. Caso o faça, pode escolher também um dos itens da lista abaixo:",
            options: [
                "Os efeitos do feitiço são maximizados",
                "Os alvos do feitiço são dobrados"
            ]
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "armadura_arcana",
            name: "Armadura Arcana",
            replaces: "Proteção Arcana",
            description: "Enquanto estiver com pelo menos um feitiço de nível 1 ou superior preparado, você recebe armadura +4."
        },
        {
            id: "mestre",
            name: "Mestre",
            requires: "Prodígio",
            description: "Você pode preparar um feitiço adicional de um círculo acima do seu nível atual (requer Prodígio)."
        },
        {
            id: "ampliacao_magica",
            name: "Ampliação Mágica",
            trigger: "Quando causar dano em uma criatura",
            description: "Quando causar dano em uma criatura, você pode aplicar a energia de um feitiço diretamente contra ela. Encerre um de seus feitiços contínuos e adicione seu nível ao dano causado."
        },
        {
            id: "fios_misticos_marionete",
            name: "Fios Místicos de Marionete",
            trigger: "Quando utilizar feitiços para controlar as ações de outras pessoas",
            description: "Quando utilizar feitiços para controlar as ações de outras pessoas, elas não se lembrarão do que fizeram sob suas ordens, e não lhe desejarão nenhum mal."
        },
        {
            id: "contramagica_protetora",
            name: "Contramágica Protetora",
            requires: "Contramágica",
            description: "Quando um aliado em sua linha de visão for afetado por um feitiço, você pode contê-lo como se você fosse o alvo. Caso um feitiço afete vários aliados, você deve fazer uma contramágica para cada um separadamente."
        },
        {
            id: "logica_extrema",
            name: "Lógica Extrema",
            replaces: "Lógica",
            trigger: "Quando utilizar puramente seu poder de dedução para analisar os arredores",
            description: "Quando utilizar puramente seu poder de dedução para analisar os arredores, você pode discernir realidades com INT no lugar de SAB. Com 12+, você pode fazer ao MJ quaisquer três perguntas, sem ser limitado pela lista."
        },
        {
            id: "alma_encantador",
            name: "Alma de Encantador",
            requires: "Encantador",
            trigger: "Quando puder passar um tempo estudando um item mágico em um local seguro",
            description: "Quando puder passar um tempo estudando um item mágico em um local seguro, você pode aumentar o poder do objeto para que, da próxima vez que o utilizar, seus efeitos sejam amplificados. O MJ lhe dirá como."
        },
        {
            id: "autossuficiente",
            name: "Autossuficiente",
            trigger: "Quando tiver tempo, materiais arcanos, e um lugar seguro",
            description: "Quando tiver tempo, materiais arcanos, e um lugar seguro, você pode criar seu próprio local de poder. Descreva para o MJ que tipo de poder é esse e como irá vinculá-lo ao local. O MJ lhe informará um tipo de criatura que terá interesse em seus trabalhos."
        },
        {
            id: "magia_potencializada_superior",
            name: "Magia Potencializada Superior",
            replaces: "Magia Potencializada",
            trigger: "Quando conjurar feitiços",
            description: "Quando conjurar feitiços, com 10+ você pode escolher um item da lista de 7–9. Caso o faça, pode escolher também um dos itens da lista abaixo. Com 12+, você pode escolher um dos itens da lista abaixo sem custo:",
            options: [
                "Os efeitos do feitiço são dobrados",
                "Os alvos do feitiço são dobrados"
            ]
        },
        {
            id: "corrente_eterea",
            name: "Corrente Etérea",
            trigger: "Quando passar um tempo com um alvo disposto ou incapacitado",
            description: "Quando passar um tempo com um alvo disposto ou incapacitado, você pode forjar uma corrente etérea entre vocês. Você passa a perceber o que o alvo percebe e pode discernir realidades a respeito dele ou de seus arredores independentemente da distância que os separar. Uma pessoa que tenha se disposto a forjar esta corrente consegue se comunicar com você como se ambos estivessem na mesma sala."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_MAGO = CLASS_MAGO;
}

