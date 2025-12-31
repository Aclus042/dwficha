/**
 * =====================================================
 * DUNGEON WORLD - CLÉRIGO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_CLERIGO = {
    id: "clerigo",
    name: "Clérigo",
    namePlural: "Clérigos",
    description: "Um devoto que canaliza o poder divino para curar aliados e punir inimigos.",
    
    // CARACTERÍSTICAS
    baseHP: 8,
    baseDamage: "d6",
    baseLoad: 10, // 10+FOR
    
    // RAÇAS
    races: [
        {
            id: "anao",
            name: "Anão",
            description: "Você é um com a pedra. Quando comungar, receba como uma oração uma versão especial de Palavras dos Silenciosos que só funciona com pedras."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Sua fé é distinta. Escolha um feitiço de mago: você pode recebê-lo e conjurá-lo como se fosse um feitiço de clérigo.",
            requiresSpellChoice: true,
            spellChoiceSource: "mago"
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "bom",
            name: "Bom",
            description: "Colocar-se em perigo para curar outra pessoa."
        },
        {
            id: "ordeiro",
            name: "Ordeiro",
            description: "Colocar-se em perigo seguindo os preceitos de sua igreja ou deus."
        },
        {
            id: "mal",
            name: "Mal",
            description: "Prejudicar outra pessoa para provar a superioridade de sua igreja ou deus."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "________________ insultou minha divindade; eu não confio nele.",
        "________________ é uma pessoa boa e fiel; eu confio nele implicitamente.",
        "________________ está em constantemente em perigo, mas o(a) manterei a salvo.",
        "Estou trabalhando para converter ________________ à minha fé."
    ],
    
    // DIVINDADE - Domínios e Preceitos
    divinity: {
        domains: [
            { id: "cura_restauracao", name: "Cura e Restauração" },
            { id: "conquista_sangrenta", name: "Conquista Sangrenta" },
            { id: "civilizacao", name: "Civilização" },
            { id: "conhecimento_ocultas", name: "Conhecimento e Coisas Ocultas" },
            { id: "oprimidos_esquecidos", name: "Os Oprimidos e Esquecidos" },
            { id: "que_existe_abaixo", name: "O Que Existe Abaixo" }
        ],
        precepts: [
            { 
                id: "sofrimento", 
                name: "Sua religião prega a santidade do sofrimento", 
                suplica: "Súplica: Sofrimento"
            },
            { 
                id: "segredos", 
                name: "Sua religião é cultista e insular", 
                suplica: "Súplica: Ganhando Segredos"
            },
            { 
                id: "oferenda", 
                name: "Sua religião possui importantes rituais de sacrifício", 
                suplica: "Súplica: Oferenda"
            },
            { 
                id: "vitoria", 
                name: "Sua religião acredita em julgamento pelo combate", 
                suplica: "Súplica: Vitória Pessoal"
            }
        ]
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] },
            { name: "Símbolo sagrado de sua divindade", weight: 0, tags: ["peso 0"], customizable: true, customizePrompt: "descreva-o" }
        ],
        choices: [
            {
                id: "defesa",
                title: "Escolha suas defesas:",
                multiSelect: true,
                options: [
                    {
                        id: "cota_malha",
                        items: [
                            { name: "Cota de malha", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] }
                        ]
                    },
                    {
                        id: "escudo",
                        items: [
                            { name: "Escudo", weight: 2, armor: 1, tags: ["armadura +1", "peso 2"] }
                        ]
                    }
                ]
            },
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "martelo_batalha",
                        items: [
                            { name: "Martelo de batalha", weight: 1, tags: ["corpo a corpo", "peso 1"] }
                        ]
                    },
                    {
                        id: "maca",
                        items: [
                            { name: "Maça", weight: 1, tags: ["corpo a corpo", "peso 1"] }
                        ]
                    },
                    {
                        id: "cajado_bandagens",
                        items: [
                            { name: "Cajado", weight: 1, tags: ["corpo a corpo", "duas mãos", "peso 1"] },
                            { name: "Bandagens", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            },
            {
                id: "suprimentos",
                title: "Escolha um:",
                options: [
                    {
                        id: "aventureiro_racoes",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, tags: ["peso 1"] },
                            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] }
                        ]
                    },
                    {
                        id: "pocao_cura",
                        items: [
                            { name: "Poção de cura", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "divindade",
            name: "Divindade",
            description: "Você serve e adora uma divindade ou poder que lhe concede feitiços. Dê um nome ao seu deus (talvez Helferth, Sucellus, Zorica ou Krugon o Cruel) e escolha seu domínio:",
            domainOptions: [
                "Cura e Restauração",
                "Conquista Sangrenta",
                "Civilização",
                "Conhecimento e Coisas Ocultas",
                "Os Oprimidos e Esquecidos",
                "O Que Existe Abaixo"
            ],
            preceptOptions: [
                "Sua religião prega a santidade do sofrimento. Adicione Súplica: Sofrimento",
                "Sua religião é cultista e insular. Adicione Súplica: Ganhando Segredos",
                "Sua religião possui importantes rituais de sacrifício. Adicione Súplica: Oferenda",
                "Sua religião acredita em julgamento pelo combate. Adicione Súplica: Vitória Pessoal"
            ],
            requiresDeityName: true,
            required: true
        },
        {
            id: "conjurar_feiticos",
            name: "Conjurar Feitiços",
            trigger: "Quando conjurar um feitiço conferido a você por sua divindade",
            description: "Quando conjurar um feitiço conferido a você por sua divindade, role+SAB.",
            attribute: "sab",
            results: {
                success: "O feitiço é conjurado com sucesso e sua divindade não o revoga, logo, você poderá conjurá-lo novamente.",
                partial: "O feitiço é conjurado, mas escolha um:"
            },
            partialOptions: [
                "Você atrai atenção indesejada ou se coloca em evidência (o MJ descreverá como);",
                "Sua conjuração lhe distancia de sua divindade – receba -1 constante em conjurar feitiços até a próxima vez que comungar novamente;",
                "Após conjurar o feitiço, ele é revogado por sua divindade. Você não pode conjurá-lo novamente até comungar e recebê-lo novamente."
            ],
            note: "Repare que a manutenção de feitiços com efeitos contínuos poderá lhe causar penalidades em sua jogada de conjurar feitiços em alguns casos.",
            required: true
        },
        {
            id: "expulsar_mortos_vivos",
            name: "Expulsar Mortos-Vivos",
            trigger: "Quando erguer seu símbolo sagrado e chamar por sua divindade em busca de proteção",
            description: "Quando erguer seu símbolo sagrado e chamar por sua divindade em busca de proteção, role+SAB.",
            attribute: "sab",
            results: {
                success: "Mortos-vivos inteligentes ficam momentaneamente ofuscados, e mortos-vivos sem mente fogem. Qualquer agressão quebra este efeito e as criaturas podem voltar a agir normalmente. Mortos-vivos inteligentes ainda podem encontrar meios de lhe causar mal à distância. Eles são espertos assim.",
                partial: "Enquanto continuar brandindo seu símbolo sagrado em oração, nenhum morto-vivo poderá se aproximar de você."
            },
            required: true
        },
        {
            id: "comungar",
            name: "Comungar",
            trigger: "Quando passar algum tempo ininterrupto em silenciosa comunhão com sua divindade (uma hora, aproximadamente)",
            description: "Quando passar algum tempo ininterrupto em silenciosa comunhão com sua divindade (uma hora, aproximadamente), você:",
            options: [
                "Perde todos os feitiços que lhe foram concedidos.",
                "Recebe novos feitiços à sua escolha, cujo total de níveis não supere seu próprio nível+1. O nível de nenhum deles pode superar o seu.",
                "Prepare todas as suas orações – elas não contam para o limite acima."
            ],
            required: true
        },
        {
            id: "orientacao_divina",
            name: "Orientação Divina",
            trigger: "Quando fizer uma súplica adequada aos preceitos de sua religião",
            description: "Quando fizer uma súplica adequada aos preceitos de sua religião, sua divindade lhe concederá algum conhecimento útil ou benefício relacionado aos seus domínios. O MJ lhe dirá qual.",
            required: true            
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "escolhido",
            name: "O Escolhido",
            description: "Escolha um feitiço. Ele lhe é concedido como se fosse 1 nível menor.",
            requiresSpellChoice: true,
            spellChoiceKey: "chosenSpell"
        },
        {
            id: "revigorar",
            name: "Revigorar",
            trigger: "Quando curar alguém",
            description: "Quando curar alguém, essa pessoa receberá +2 adiante em seu dano."
        },
        {
            id: "protecao_divina",
            name: "Proteção Divina",
            trigger: "Quando não estiver usando armadura ou escudo",
            description: "Quando não estiver usando armadura ou escudo, receba armadura 2."
        },
        {
            id: "serenidade",
            name: "Serenidade",
            trigger: "Quando conjurar um feitiço",
            description: "Quando conjurar um feitiço, ignore -1 de penalidade relacionada a feitiços contínuos."
        },
        {
            id: "curandeiro_devoto",
            name: "Curandeiro Devoto",
            trigger: "Quando curar outra pessoa",
            description: "Quando curar outra pessoa, adicione seu nível à quantidade de dano curado."
        },
        {
            id: "equilibrio_vida_morte",
            name: "O Equilíbrio Entre a Vida e a Morte",
            trigger: "Quando alguém tomar seu último suspiro em sua presença",
            description: "Quando alguém tomar seu último suspiro em sua presença, essa pessoa receberá +1 na rolagem."
        },
        {
            id: "primeiros_socorros",
            name: "Primeiros Socorros",
            description: "Curar Ferimentos Leves é considerado uma oração para você, logo, não conta para o seu limite de feitiços concedidos."
        },
        {
            id: "penitente",
            name: "Penitente",
            trigger: "Quando receber dano e abraçar a dor",
            description: "Quando receber dano e abraçar a dor, você pode sofrer +1d4 de dano (ignorando armadura). Caso o faça, receba +1 adiante para conjurar feitiços."
        },
        {
            id: "prece_por_orientacao",
            name: "Prece por Orientação",
            trigger: "Quando sacrificar algo de valor para sua divindade e rezar pedindo por sua orientação",
            description: "Quando sacrificar algo de valor para sua divindade e rezar pedindo por sua orientação, sua divindade lhe dirá o que ela quer que você faça. Se você o fizer, marque experiência.",
            grantsXP: true,
            xpTrigger: "Cumprir o que sua divindade quer que você faça"            
        },
        {
            id: "potencializar",
            name: "Potencializar",
            trigger: "Quando conjurar um feitiço",
            description: "Quando conjurar um feitiço, com 10+ você pode optar por escolher um item da lista de 7–9. Caso o faça, escolha também um dos efeitos abaixo:",
            options: [
                "Os efeitos da magia são dobrados",
                "Os alvos da magia são dobrados"
            ]
        },
        {
            id: "intervencao_divina",
            name: "Intervenção Divina",
            trigger: "Quando comungar",
            description: "Quando comungar, receba domínio 1 e perca todo o domínio que possuía. Gaste esse domínio quando você ou um aliado receber dano para invocar sua divindade. Ela irá intervir através de uma manifestação adequada (uma ventania súbita, um escorregão sortudo, uma explosão de luz) e negar todo o dano."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "armadura_divina",
            name: "Armadura Divina",
            replaces: "Proteção Divina",
            trigger: "Quando não estiver usando armadura ou escudo",
            description: "Quando não estiver usando armadura ou escudo, receba armadura 3."
        },
        {
            id: "providencia",
            name: "Providência",
            replaces: "Serenidade",
            description: "Ignore a penalidade de -1 proveniente de dois feitiços que esteja mantendo."
        },
        {
            id: "abencoado",
            name: "Abençoado",
            requires: "O Escolhido",
            description: "Escolha um feitiço diferente daquele já selecionado anteriormente. Ele lhe é concedido como se fosse 1 nível menor.",
            requiresSpellChoice: true,
            spellChoiceKey: "blessedSpell"
        },
        {
            id: "primeiros_socorros_superiores",
            name: "Primeiros Socorros Superiores",
            requires: "Primeiros Socorros",
            description: "Curar Ferimentos Moderados é considerado uma oração para você, logo, não conta para o seu limite de feitiços concedidos."
        },
        {
            id: "amador_multiclasse",
            name: "Amador em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Trate seu nível como se fosse 1 menor no momento da escolha.",
            allowsMulticlass: true
        },
        {
            id: "ceifador",
            name: "Ceifador",
            trigger: "Quando parar um momento após um conflito para dedicar sua vitória à sua divindade e lidar adequadamente com os mortos",
            description: "Quando parar um momento após um conflito para dedicar sua vitória à sua divindade e lidar adequadamente com os mortos, receba +1 adiante."
        },
        {
            id: "martir",
            name: "Mártir",
            replaces: "Penitente",
            trigger: "Quando receber dano e abraçar a dor",
            description: "Quando receber dano e abraçar a dor, você pode sofrer +1d4 de dano (ignorando armadura). Caso o faça, receba +1 adiante para conjurar feitiços e some seu nível ao dano causado ou curado por ele."
        },
        {
            id: "potencializar_superior",
            name: "Potencializar Superior",
            replaces: "Potencializar",
            trigger: "Quando conjurar um feitiço",
            description: "Quando conjurar um feitiço, com 10+ você pode optar por escolher um item da lista de 7–9. Caso o faça, escolha um dos efeitos abaixo também. Com 12+, escolha um desses efeitos de graça:",
            options: [
                "Os efeitos da magia são dobrados",
                "Os alvos da magia são dobrados"
            ]
        },
        {
            id: "apoteose",
            name: "Apoteose",
            description: "Na próxima vez que passar algum tempo em oração apropriada para seu deus após optar por este movimento, escolha uma característica associada a ele (garras dilaceradoras, asas de penas de safira, um terceiro olho que tudo vê, etc.). Assim que emergir de suas preces, ganhe permanentemente tal característica física."
        },
        {
            id: "invencibilidade_divina",
            name: "Invencibilidade Divina",
            replaces: "Intervenção Divina",
            trigger: "Quando comungar",
            description: "Quando comungar, receba domínio 2 e perca todo o domínio que possuía. Gaste 1 domínio quando você ou um aliado receber dano para invocar sua divindade. Ela irá intervir através de uma manifestação adequada (uma ventania súbita, um escorregão sortudo, uma explosão de luz) e negar todo o dano."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_CLERIGO = CLASS_CLERIGO;
}

