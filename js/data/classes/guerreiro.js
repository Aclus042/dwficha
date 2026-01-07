/**
 * =====================================================
 * DUNGEON WORLD - GUERREIRO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_GUERREIRO = {
    id: "guerreiro",
    name: "Guerreiro",
    namePlural: "Guerreiros",
    description: "Um mestre das armas que domina o campo de batalha com técnica e bravura.",
    
    // CARACTERÍSTICAS
    baseHP: 10,
    baseDamage: "d10",
    baseLoad: 12, // 12+FOR
    
    // RAÇAS
    races: [
        {
            id: "anao",
            name: "Anão",
            description: "Quando compartilhar uma bebida com alguém, você pode negociar com aquela pessoa usando CON no lugar de CAR."
        },
        {
            id: "elfo",
            name: "Elfo",
            description: "Escolha uma arma – você trata armas daquele tipo como se sempre possuíssem o rótulo precisa.",
            requiresChoice: true,
            choiceType: "text",
            choicePrompt: "Qual arma recebe o rótulo precisa?",
            choicePlaceholder: "Ex: Espadas longas, Arcos, Lanças..."
        },
        {
            id: "halfling",
            name: "Halfling",
            description: "Quando você desafiar o perigo e usar seu tamanho diminuto em sua vantagem, receba +1."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Uma vez por batalha, você pode rolar novamente um rolamento de dano (seu ou de outra pessoa)."
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "bom",
            name: "Bom",
            description: "Defender aqueles mais fracos que você."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Derrotar um adversário à sua altura."
        },
        {
            id: "mal",
            name: "Mal",
            description: "Matar um inimigo indefeso ou cercado."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "________________ me deve sua vida, quer admita isso ou não.",
        "Eu jurei proteger ________________.",
        "Eu me preocupo com a capacidade de ________________ de sobreviver dentro das masmorras.",
        "________________ é muito mole, mas o tornarei resistente como eu."
    ],
    
    // ARMA FAVORITA - Sistema interativo especial
    signatureWeapon: {
        baseDescription: "Esta é sua arma. Existem muitas iguais a ela, mas esta é sua. Ela é sua melhor amiga. Ela é sua vida. Você a domina como domina a si próprio. Sua arma, sem você, é inútil. Sem sua arma, você é inútil. Empunhe-a e seja autêntico.",
        baseWeight: 2,
        
        // Passo 1: Tipo base
        baseTypes: {
            title: "Descrição básica (todas possuem peso 2):",
            options: [
                { id: "espada", name: "Espada" },
                { id: "machado", name: "Machado" },
                { id: "martelo", name: "Martelo" },
                { id: "lanca", name: "Lança" },
                { id: "mangual", name: "Mangual" },
                { id: "punhos", name: "Punhos" }
            ]
        },
        
        // Passo 2: Distância
        ranges: {
            title: "Distância:",
            options: [
                { id: "mao", name: "Mão", tag: "mão" },
                { id: "corpo_a_corpo", name: "Corpo a corpo", tag: "corpo a corpo" },
                { id: "alcance", name: "Alcance", tag: "alcance" }
            ]
        },
        
        // Passo 3: Melhorias (escolher 2)
        enhancements: {
            title: "Escolha DUAS melhorias:",
            count: 2,
            options: [
                { 
                    id: "ganchos_espinhos", 
                    name: "Ganchos e espinhos", 
                    description: "+1 de dano, +1 de peso",
                    damageBonus: 1,
                    weightBonus: 1
                },
                { 
                    id: "afiada", 
                    name: "Afiada", 
                    description: "+2 penetrante",
                    tags: ["+2 penetrante"]
                },
                { 
                    id: "perfeitamente_balanceada", 
                    name: "Perfeitamente balanceada", 
                    description: "Torna-se precisa",
                    tags: ["precisa"]
                },
                { 
                    id: "fio_serrilhado", 
                    name: "Fio serrilhado", 
                    description: "+1 de dano",
                    damageBonus: 1
                },
                { 
                    id: "brilha", 
                    name: "Brilha na presença de um tipo de criatura à sua escolha",
                    requiresChoice: true,
                    choicePrompt: "Qual tipo de criatura?"
                },
                { 
                    id: "enorme", 
                    name: "Enorme", 
                    description: "Torna-se grotesca e poderosa",
                    tags: ["grotesca", "poderosa"]
                },
                { 
                    id: "versatil", 
                    name: "Versátil", 
                    description: "Escolha um alcance adicional",
                    requiresChoice: true,
                    choiceType: "range",
                    choicePrompt: "Escolha um alcance adicional:"
                },
                { 
                    id: "alta_qualidade", 
                    name: "Alta qualidade", 
                    description: "-1 de peso",
                    weightBonus: -1
                }
            ]
        },
        
        // Passo 4: Aparência
        looks: {
            title: "Aparência:",
            options: [
                { id: "antiga", name: "Antiga" },
                { id: "imaculada", name: "Imaculada" },
                { id: "ornada", name: "Ornada" },
                { id: "manchada_sangue", name: "Manchada de sangue" },
                { id: "sinistra", name: "Sinistra" }
            ]
        }
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Sua arma favorita", weight: 2, tags: ["ver Arma Favorita"], isSignatureWeapon: true },
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] }
        ],
        choices: [
            {
                id: "defesas",
                title: "Defesas (escolha UMA):",
                options: [
                    {
                        id: "cota_equipamento",
                        items: [
                            { name: "Cota de malha", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] },
                            { name: "Equipamento de aventureiro", weight: 1, uses: 5, tags: ["5 usos", "peso 1"] }
                        ]
                    },
                    {
                        id: "armadura_escamas",
                        items: [
                            { name: "Armadura de escamas", weight: 3, armor: 2, tags: ["armadura 2", "peso 3"] }
                        ]
                    }
                ]
            },
            {
                id: "extra",
                title: "Extras (escolha DOIS):",
                multiSelect: true,
                maxChoices: 2,
                options: [
                    {
                        id: "pocoes_cura",
                        items: [
                            { name: "2 poções de cura", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "escudo",
                        items: [
                            { name: "Escudo", weight: 2, armor: 1, tags: ["armadura +1", "peso 2"] }
                        ]
                    },
                    {
                        id: "suprimentos",
                        items: [
                            { name: "Antitoxina", weight: 0, tags: ["peso 0"] },
                            { name: "Rações de masmorra", weight: 1, tags: ["peso 1"] },
                            { name: "Cataplasmas e ervas", weight: 1, tags: ["peso 1"] }
                        ]
                    },
                    {
                        id: "moedas",
                        items: [
                            { name: "22 moedas", weight: 0, tags: [] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "arma_favorita",
            name: "Arma Favorita",
            description: "Esta é sua arma. Existem muitas iguais a ela, mas esta é sua. Ela é sua melhor amiga. Ela é sua vida. Você a domina como domina a si próprio. Sua arma, sem você, é inútil. Sem sua arma, você é inútil. Empunhe-a e seja autêntico.",
            hasSignatureWeaponBuilder: true,
            signatureWeaponNote: "Configure sua arma favorita na seção dedicada abaixo.",
            required: true            
        },
        {
            id: "fortificado",
            name: "Fortificado",
            description: "Ignore o rótulo desengonçada em qualquer armadura que você vestir.",
            required: true
        },
        {
            id: "dobrar_barras",
            name: "Dobrar Barras, Suspender Portais",
            trigger: "Quando usar força bruta para destruir um objeto inanimado",
            description: "Quando usar força bruta para destruir um objeto inanimado, role+FOR.\n\nCom 10+, escolha 3.\nCom 7–9, escolha 2.",
            attribute: "for",
            results: {
                success: "Escolha 3.",
                partial: "Escolha 2."
            },
            options: [
                "Não demora muito",
                "Nada de valor é danificado",
                "Não provoca uma barulheira absurda",
                "Você pode consertar o objeto sem muito esforço"
            ],
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "pele_ferro",
            name: "Pele de Ferro",
            description: "Você recebe +1 de armadura.",
            armorBonus: 1
        },
        {
            id: "implacavel",
            name: "Implacável",
            trigger: "Quando causar dano",
            description: "Quando causar dano, cause +1d4 de dano."
        },
        {
            id: "arma_melhorada",
            name: "Arma Melhorada",
            description: "Escolha uma melhoria extra para sua arma favorita.",
            grantsExtraEnhancement: true
        },
        {
            id: "visao_rubra",
            name: "Visão Rubra",
            trigger: "Quando discernir a realidade durante um combate",
            description: "Quando discernir a realidade durante um combate, receba +1."
        },
        {
            id: "cheiro_sangue",
            name: "Cheiro de Sangue",
            trigger: "Após utilizar matar e pilhar contra um inimigo",
            description: "Após utilizar matar e pilhar contra um inimigo, seu próximo ataque contra ele recebe +1d4 de dano."
        },
        {
            id: "inquisidor",
            name: "Inquisidor",
            trigger: "Quando negociar usando ameaças de violência iminente como influência",
            description: "Quando negociar usando ameaças de violência iminente como influência, você pode usar FOR no lugar de CAR."
        },
        {
            id: "amador_multiclasse",
            name: "Amador em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Para escolha do movimento, considere como se tivesse 1 nível a menos.",
            allowsMulticlass: true
        },
        {
            id: "ferreiro",
            name: "Ferreiro",
            trigger: "Quando tiver acesso a uma forja",
            description: "Quando tiver acesso a uma forja, você pode transferir os poderes mágicos de uma arma para sua arma favorita. Este processo destrói a arma mágica. Sua arma favorita adquire os poderes mágicos da arma destruída."
        },
        {
            id: "reliquia_familia",
            name: "Relíquia de Família",
            trigger: "Quando consultar os espíritos que residem dentro de sua arma favorita",
            description: "Quando consultar os espíritos que residem dentro de sua arma favorita, role+CAR. Eles irão lhe revelar alguma coisa a respeito de sua situação atual, e podem lhe perguntar alguma coisa em retorno.",
            attribute: "car",
            results: {
                success: "O MJ vai lhe dar muitos detalhes.",
                partial: "Ele lhe dará apenas uma vaga impressão."
            }
        },
        {
            id: "maestria_armadura",
            name: "Maestria com Armadura",
            trigger: "Quando deixar sua armadura absorver a maior parte de um golpe recebido",
            description: "Quando deixar sua armadura absorver a maior parte de um golpe recebido, o dano causado é negado e você deve reduzir o valor de sua armadura ou escudo (sua escolha) em 1. Tal valor é reduzido sempre que você fizer esta opção. Se isso reduzir o item a 0 de armadura, ele será destruído."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "pele_aco",
            name: "Pele de Aço",
            replaces: "Pele de Ferro",
            description: "Você recebe +2 de armadura.",
            armorBonus: 2
        },
        {
            id: "sede_sangue",
            name: "Sede de Sangue",
            replaces: "Implacável",
            trigger: "Quando causar dano",
            description: "Quando causar dano, cause +1d8 de dano."
        },
        {
            id: "gosto_sangue",
            name: "Gosto por Sangue",
            replaces: "Cheiro de Sangue",
            trigger: "Após utilizar matar e pilhar contra um inimigo",
            description: "Após utilizar matar e pilhar contra um inimigo, seu próximo ataque contra ele recebe +1d8 de dano."
        },
        {
            id: "foco_armamento",
            name: "Foco no Armamento",
            trigger: "Quando verificar as armas de seus inimigos",
            description: "Quando verificar as armas de seus inimigos, pergunte ao MJ qual é o dano que elas causam."
        },
        {
            id: "iniciado_multiclasse",
            name: "Iniciado em Multiclasse",
            requires: "Amador em Multiclasse",
            description: "Escolha e adquira um movimento de outra classe. Trate seu nível como se fosse 1 menor no momento da escolha.",
            allowsMulticlass: true
        },
        {
            id: "guerreiro_superior",
            name: "Guerreiro Superior",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, caso role 12+, cause seu dano, evite o contra-ataque, e impressione, desanime ou amedronte seu adversário."
        },
        {
            id: "mau_olhado",
            name: "Mau Olhado",
            requires: "Visão Rubra",
            trigger: "Quando entrar em combate",
            description: "Quando entrar em combate, role+CAR. Gaste seu domínio para fazer contato visual com um PNJ próximo. Ele ficará congelado ou hesitante, e impedido de agir até que você rompa o contato.",
            attribute: "car",
            results: {
                success: "Domínio 2.",
                partial: "Domínio 1.",
                fail: "Seus inimigos imediatamente o identificam como sua maior ameaça."
            },
            hasHoldSystem: true,
            holdName: "domínio"
        },
        {
            id: "atraves_olhos_morte",
            name: "Através dos Olhos da Morte",
            trigger: "Quando entrar em batalha",
            description: "Quando entrar em batalha, role+SAB. Diga apenas os nomes de PNJ, nunca de personagens jogadores. O MJ fará com que sua visão torne-se realidade, por mais improvável que seja.",
            attribute: "sab",
            results: {
                success: "Diga o nome de alguém que sobreviverá, e o nome de alguém que morrerá.",
                partial: "Diga o nome de alguém que sobreviverá ou de alguém que morrerá.",
                fail: "Você enxerga sua própria morte e, consequentemente, recebe -1 durante toda a batalha."
            }
        },
        {
            id: "perfeicao_armadura",
            name: "Perfeição com Armadura",
            replaces: "Maestria com Armadura",
            trigger: "Quando deixar sua armadura absorver a maior parte de um golpe recebido",
            description: "Quando deixar sua armadura absorver a maior parte de um golpe recebido, o dano causado é negado e você recebe +1 adiante contra o atacante, mas deve reduzir o valor de sua armadura ou escudo (sua escolha) em 1. Tal valor é reduzido sempre que você fizer esta opção. Se isso reduzir o item a 0 de armadura, ele será destruído."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_GUERREIRO = CLASS_GUERREIRO;
}

