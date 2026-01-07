/**
 * =====================================================
 * DUNGEON WORLD - RANGER
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_RANGER = {
    id: "ranger",
    name: "Ranger",
    namePlural: "Rangers",
    description: "Um caçador das terras selvagens com um leal companheiro animal ao seu lado.",
    
    // CARACTERÍSTICAS
    baseHP: 8,
    baseDamage: "d8",
    baseLoad: 11, // 11+FOR
    
    // RAÇAS
    races: [
        {
            id: "elfo",
            name: "Elfo",
            description: "Quando empreender uma jornada perigosa através de terras ermas, independente de qual seja seu papel, você sempre conseguirá um acerto como se tivesse rolado 10+ nos dados."
        },
        {
            id: "humano",
            name: "Humano",
            description: "Quando preparar acampamento dentro de uma masmorra ou cidade, você não precisa consumir uma ração."
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "caotico",
            name: "Caótico",
            description: "Libertar alguém de amarras literais ou metafóricas."
        },
        {
            id: "bom",
            name: "Bom",
            description: "Colocar-se em perigo para combater uma ameaça sobrenatural."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Ajudar um animal ou espírito selvagem."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "Eu já havia guiado ________________ anteriormente, e ele(a) ainda me deve por isso.",
        "________________ nutre amizade pela natureza, e por isso, também lhe ofereci a minha.",
        "________________ não respeita a natureza, logo, também não tem meu respeito.",
        "________________ não entende a vida selvagem, mas eu lhe ensinarei."
    ],
    
    // SISTEMA DE COMPANHEIRO ANIMAL
    animalCompanion: {
        description: "Você possui uma conexão sobrenatural com um animal leal. Vocês não conseguem exatamente conversar, mas a criatura sempre age de acordo com sua vontade. Dê um nome ao seu companheiro animal e escolha uma espécie:",
        speciesOptions: [
            "Lobo", "Puma", "Urso", "Águia", "Cachorro", "Falcão", "Gato", "Coruja", "Pombo", "Rato", "Mula"
        ],
        baseNote: "Escolha uma base:",
        bases: [
            { ferocity: 2, cunning: 1, armor: 1, instinct: 1 },
            { ferocity: 2, cunning: 2, armor: 0, instinct: 1 },
            { ferocity: 1, cunning: 2, armor: 1, instinct: 1 },
            { ferocity: 3, cunning: 1, armor: 1, instinct: 2 }
        ],
        strengthsNote: "Escolha uma quantidade de forças igual à ferocidade:",
        strengths: [
            "Ágil", "Corpulento", "Enorme", "Calmo", "Adaptável", "Reflexos rápidos",
            "Incansável", "Camuflagem", "Feroz", "Intimidador", "Sentidos aguçados", "Furtivo"
        ],
        trainingNote: "Seu animal é treinado para enfrentar criaturas humanoides. Escolha uma quantidade adicional de treinamentos igual à astúcia:",
        trainings: [
            "Caçar", "Buscar", "Batedor", "Proteger", "Lutar com monstros", "Performance", "Trabalhar", "Viajar"
        ],
        weaknessesNote: "Escolha uma quantidade de fraquezas igual ao instinto:",
        weaknesses: [
            "Fujão", "Selvagem", "Lento", "Submisso", "Assustador", "Esquecido", "Teimoso", "Coxo"
        ]
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] },
            { name: "Armadura de couro", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] },
            { name: "Fardo de flechas", weight: 1, tags: ["munição 3", "peso 1"] }
        ],
        choices: [
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "arco_espada",
                        items: [
                            { name: "Arco de caçador", weight: 1, tags: ["próximo", "distante", "peso 1"] },
                            { name: "Espada curta", weight: 1, tags: ["corpo a corpo", "peso 1"] }
                        ]
                    },
                    {
                        id: "arco_lanca",
                        items: [
                            { name: "Arco de caçador", weight: 1, tags: ["próximo", "distante", "peso 1"] },
                            { name: "Lança", weight: 1, tags: ["alcance", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "item_extra",
                title: "Escolha um:",
                options: [
                    {
                        id: "equipamento_racoes",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, uses: 5, tags: ["5 usos", "peso 1"] },
                            { name: "Rações de masmorra", weight: 1, tags: ["peso 1"] }
                        ]
                    },
                    {
                        id: "equipamento_flechas",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, uses: 5, tags: ["5 usos", "peso 1"] },
                            { name: "Fardo de flechas", weight: 1, tags: ["munição 3", "peso 1"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "cacar_rastrear",
            name: "Caçar e Rastrear",
            trigger: "Quando seguir uma trilha de pistas deixadas por criaturas que tenham passado por ali",
            description: "Quando seguir uma trilha de pistas deixadas por criaturas que tenham passado por ali, role+SAB.",
            attribute: "sab",
            results: {
                success: "Você consegue seguir o rastro até que haja uma mudança significativa em sua direção ou modo de viagem. Você também pode escolher 1 dos itens abaixo:",
                partial: "Você consegue seguir o rastro até que haja uma mudança significativa em sua direção ou modo de viagem."
            },
            options: [
                "Obtenha alguma informação a respeito de sua presa, dada pelo MJ",
                "Determine o que causou a interrupção de seus rastros"
            ],
            required: true
        },
        {
            id: "tiro_ao_alvo",
            name: "Tiro ao Alvo",
            trigger: "Quando atacar um inimigo surpreso ou indefeso à distância",
            description: "Quando atacar um inimigo surpreso ou indefeso à distância, você pode optar por causar seu dano, ou indique seu alvo e role+DES:",
            attribute: "des",
            targetOptions: [
                {
                    id: "cabeca",
                    name: "Cabeça",
                    partial: "O alvo não consegue fazer nada a não ser ficar parado babando por alguns momentos.",
                    success: "Aplique o efeito de 7-9, mais seu dano."
                },
                {
                    id: "bracos",
                    name: "Braços",
                    partial: "O alvo deixa cair qualquer coisa que esteja segurando.",
                    success: "Aplique o efeito de 7-9, mais seu dano."
                },
                {
                    id: "pernas",
                    name: "Pernas",
                    partial: "O alvo fica mancando e passa a se mover mais lentamente.",
                    success: "Aplique o efeito de 7-9, mais seu dano."
                }
            ],
            required: true
        },
        {
            id: "companheiro_animal",
            name: "Companheiro Animal",
            description: "Você possui uma conexão sobrenatural com um animal leal. Vocês não conseguem exatamente conversar, mas a criatura sempre age de acordo com sua vontade. Dê um nome ao seu companheiro animal e escolha uma espécie:",
            hasAnimalCompanionSystem: true,
            required: true
        },
        {
            id: "comandar",
            name: "Comandar",
            trigger: "Quando trabalhar com seu companheiro animal em alguma coisa para a qual ele é treinado",
            description: "Quando trabalhar com seu companheiro animal em alguma coisa para a qual ele é treinado...",
            commandOptions: [
                "… e atacarem o mesmo alvo, some a ferocidade dele ao seu dano.",
                "… e rastrearem uma trilha, some a astúcia dele ao seu rolamento.",
                "… e você sofrer dano, some a armadura dele à sua armadura.",
                "… e você discernir realidades, some a astúcia dele ao seu rolamento.",
                "… e você negociar, some a astúcia dele ao seu rolamento.",
                "… e alguma pessoa interferir com vocês, some o instinto dele ao rolamento da pessoa."
            ],
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "bem_treinado",
            name: "Bem Treinado",
            description: "Escolha mais um treinamento para seu companheiro animal."
        },
        {
            id: "empatia_selvagem",
            name: "Empatia Selvagem",
            description: "Você é capaz de falar com os animais e de compreendê-los."
        },
        {
            id: "presa_conhecida",
            name: "Presa Conhecida",
            trigger: "Quando falar difícil sobre um monstro",
            description: "Quando falar difícil sobre um monstro, use SAB no lugar de INT."
        },
        {
            id: "golpe_vibora",
            name: "Golpe da Víbora",
            trigger: "Quando atacar um inimigo com duas armas ao mesmo tempo",
            description: "Quando atacar um inimigo com duas armas ao mesmo tempo, adicione +1d4 ao dano causado devido à sua arma extra."
        },
        {
            id: "local_seguro",
            name: "Local Seguro",
            trigger: "Quando você preparar os turnos de guarda que ocorrerão durante a noite",
            description: "Quando você preparar os turnos de guarda que ocorrerão durante a noite, todos recebem +1 para montar guarda."
        },
        {
            id: "camuflagem",
            name: "Camuflagem",
            description: "Enquanto permanecer imóvel em lugares naturais, seus inimigos serão incapazes de localizá-lo até que você se movimente de alguma forma."
        },
        {
            id: "sigam_me",
            name: "Sigam-me",
            trigger: "Quando empreender uma jornada perigosa",
            description: "Quando empreender uma jornada perigosa, você pode realizar dois papéis. Faça uma rolagem separada para cada um deles."
        },
        {
            id: "apagar_sol",
            name: "Apagar o Sol",
            trigger: "Quando disparar",
            description: "Quando disparar, você pode gastar munição extra antes de rolar os dados. Para cada ponto de munição gasto dessa forma, escolha um alvo adicional. Role apenas uma vez e aplique o dano a todos os alvos."
        },
        {
            id: "meio_elfo",
            name: "Meio-Elfo",
            description: "Em algum momento, sua linhagem tornou-se mestiça e as características da outra raça começaram a ficar mais evidentes. Ganhe o movimento inicial de elfo se escolheu ser humano durante a criação de personagens, ou vice-versa.",
            isFirstAdvanceOnly: true,
            firstAdvanceNote: "Adquira este movimento apenas em seu primeiro avanço de nível."
        },
        {
            id: "deuses_desolacao",
            name: "Deuses em Meio à Desolação",
            description: "Dedique-se a uma divindade (crie uma nova, ou escolha uma que já foi estabelecida anteriormente). Você recebe os movimentos de clérigo comungar e conjurar feitiços. Assim que escolher este movimento, seu personagem será considerado um clérigo de nível 1 para a utilização de feitiços. A partir daquele momento, sempre que ganhar um novo nível, aumente seu nível efetivo de clérigo em 1.",
            grantsClericSpells: true,
            grantsClericMoves: ['comungar', 'conjurar_feiticos']
        },
        {
            id: "melhor_amigo_homem",
            name: "Melhor Amigo do Homem",
            trigger: "Quando permitir que seu companheiro animal receba um ataque que era direcionado a você",
            description: "Quando permitir que seu companheiro animal receba um ataque que era direcionado a você, o dano é negado e a Ferocidade dele é alterada para 0. Se a Ferocidade atual do animal for 0, esta habilidade não pode ser usada. Após algumas horas de descanso, a Ferocidade de seu companheiro animal volta ao normal."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "barriga_smaug",
            name: "Barriga do Smaug",
            trigger: "Quando descobrir o ponto fraco de seu alvo",
            description: "Quando descobrir o ponto fraco de seu alvo, suas flechas ganham penetrante 2."
        },
        {
            id: "discurso_selvagem",
            name: "Discurso Selvagem",
            replaces: "Empatia Selvagem",
            description: "Você é capaz de falar com quaisquer criaturas que não sejam mágicas ou extraplanares, e de compreendê-las."
        },
        {
            id: "truque_especial",
            name: "Truque Especial",
            description: "Escolha um movimento de outra classe. Enquanto estiver trabalhando com seu companheiro animal, você terá acesso àquele movimento.",
            allowsMulticlass: true
        },
        {
            id: "mordida_vibora",
            name: "Mordida da Víbora",
            replaces: "Golpe da Víbora",
            trigger: "Quando atacar um inimigo com duas armas ao mesmo tempo",
            description: "Quando atacar um inimigo com duas armas ao mesmo tempo, adicione +1d8 ao dano causado devido à sua arma extra."
        },
        {
            id: "aliado_sobrenatural",
            name: "Aliado Sobrenatural",
            description: "Seu companheiro animal é um monstro, e não um animal. Descreva-o. Dê a ele Ferocidade +2 e Instinto +1, e escolha um treinamento adicional."
        },
        {
            id: "andarilho",
            name: "Andarilho",
            replaces: "Sigam-me",
            trigger: "Quando empreender uma jornada perigosa",
            description: "Quando empreender uma jornada perigosa, você pode realizar dois papéis. Faça duas rolagens e utilize o melhor resultado para ambos os papéis."
        },
        {
            id: "presa_cacador",
            name: "Presa do Caçador",
            replaces: "Presa Conhecida",
            trigger: "Quando falar difícil a respeito de um monstro",
            description: "Quando falar difícil a respeito de um monstro, use SAB no lugar de INT. Com 12+, além dos efeitos normais, você pode fazer ao MJ uma pergunta qualquer sobre o assunto."
        },
        {
            id: "observador",
            name: "Observador",
            trigger: "Quando caçar e rastrear",
            description: "Quando caçar e rastrear, caso obtenha um acerto, você também poderá fazer ao MJ uma das perguntas presentes na lista de discernir realidades a respeito da criatura perseguida."
        },
        {
            id: "local_mais_seguro",
            name: "Local Ainda Mais Seguro",
            replaces: "Local Seguro",
            trigger: "Quando você preparar os turnos de guarda que ocorrerão durante a noite",
            description: "Quando você preparar os turnos de guarda que ocorrerão durante a noite, todos recebem +1 para montar guarda. Todas as pessoas que passam a noite em um acampamento no qual você prepare os turnos de guarda recebem +1 adiante."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_RANGER = CLASS_RANGER;
}
