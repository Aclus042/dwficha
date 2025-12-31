/**
 * =====================================================
 * DUNGEON WORLD - BÁRBARO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_BARBARO = {
    id: "barbaro",
    name: "Bárbaro",
    namePlural: "Bárbaros",
    description: "Um guerreiro selvagem movido por apetites primitivos e fúria indomável.",
    
    // CARACTERÍSTICAS
    baseHP: 8,
    baseDamage: "d10",
    baseLoad: 8, // 8+FOR
    
    // O Bárbaro usa Forasteiro como raça/origem - não é uma raça tradicional
    // Ele é um movimento fixo que aparece na seção de movimentos iniciais
    races: [
        {
            id: "forasteiro",
            name: "Forasteiro",
            description: "Você pode ser um elfo, anão, halfling ou humano, mas seu povo não é dessas redondezas.",
            isBackground: true,
            required: true,
            grantsXP: true
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "caotico",
            name: "Caótico",
            description: "Se afastar de uma convenção do mundo civilizado."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Ensinar a alguém os modos de seu povo."
        }
    ],
    
    // VÍNCULOS
    suggestedBonds: [
        "________________ é fraco e tolo, mas me diverte.",
        "Os modos de ________________ são estranhos e confusos.",
        "________________ está sempre entrando em apuros – eu preciso protegê-lo de si mesmo.",
        "________________ compartilha minha fome por glória; a terra tremerá diante de nós!"
    ],
    
    // APETITES - característica única do Bárbaro
    appetites: {
        description: "Escolha dois apetites:",
        options: [
            { id: "destruicao", name: "Pura destruição" },
            { id: "poder", name: "Poder sobre outras pessoas" },
            { id: "prazeres", name: "Prazeres mortais" },
            { id: "conquista", name: "Conquista" },
            { id: "riquezas", name: "Riquezas e propriedades" },
            { id: "fama", name: "Fama e glória" }
        ]
    },
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] },
            { name: "Uma adaga", weight: 1, tags: ["mão", "peso 1"] },
            { name: "Alguma lembrança de sua jornada ou de sua terra natal", weight: 0, tags: [] }
        ],
        choices: [
            {
                id: "arma",
                title: "Uma arma à sua escolha:",
                options: [
                    {
                        id: "machado",
                        items: [
                            { name: "Machado", weight: 1, tags: ["corpo a corpo", "peso 1"] }
                        ]
                    },
                    {
                        id: "espada_duas_maos",
                        items: [
                            { name: "Espada de Duas Mãos", weight: 2, tags: ["corpo a corpo", "+1 de dano", "peso 2"] }
                        ]
                    }
                ]
            },
            {
                id: "extra",
                title: "Escolha UM:",
                options: [
                    {
                        id: "equipamento_racoes",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, tags: ["peso 1"] },
                            { name: "Rações de masmorra", weight: 1, tags: ["5 usos", "peso 1"] }
                        ]
                    },
                    {
                        id: "cota_malha",
                        items: [
                            { name: "Cota de malha", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // Escolha inicial de estilo de combate - Movimento que usa radio buttons
    combatStyleChoice: {
        title: "Escolha UM dos movimentos abaixo:",
        options: [
            {
                id: "armadura_placas",
                name: "Armadura de Placas e Portando Aço",
                description: "Você ignora o rótulo desengonçada das armaduras que vestir."
            },
            {
                id: "desimpedido",
                name: "Desimpedido e Ileso",
                description: "Enquanto estiver abaixo de sua Carga, e não estiver usando armadura nem escudo, receba +1 de armadura."
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "forasteiro",
            name: "Forasteiro",
            description: "Você pode ser um elfo, anão, halfling ou humano, mas seu povo não é dessas redondezas. No início de cada sessão, o MJ lhe perguntará algo a respeito de sua terra natal, por que você foi embora ou o que deixou para trás. Se responder, marque XP.",
            type: "racial",
            required: true,
            grantsXP: true,
            xpTrigger: "Responda à pergunta do MJ sobre sua terra natal"
        },
        {
            id: "estilo_combate",
            name: "Escolha Inicial de Estilo",
            description: "No início do jogo, escolha um dos estilos abaixo. Esta escolha define como você lida com armaduras.",
            type: "choice",
            required: true,
            combatStyleOptions: [
                {
                    id: "armadura_placas",
                    name: "Armadura de Placas e Portando Aço",
                    description: "Você ignora o rótulo desengonçada das armaduras que vestir."
                },
                {
                    id: "desimpedido",
                    name: "Desimpedido e Ileso",
                    description: "Enquanto estiver abaixo de sua Carga, e não estiver usando armadura nem escudo, receba +1 de armadura."
                }
            ]
        },
        {
            id: "musculoso",
            name: "Musculoso",
            description: "Quando portar uma arma, ela recebe os rótulos poderoso e grotesco.",
            required: true
        },
        {
            id: "controle_situacao",
            name: "Controle da Situação",
            description: "Você recebe +1 constante para seu último suspiro. Quando realizar o último suspiro, com 7-9 você pode fazer uma oferta para a Morte em troca de sua vida. Se a Morte aceitar, você viverá de novo. Caso contrário, você morre.",
            required: true
        },
        {
            id: "apetite_herculeo",
            name: "Apetite Hercúleo",
            description: "Outras pessoas podem se contentar apenas com o gosto do vinho, o domínio sobre um servo ou ambos, mas você quer mais.",
            required: true,
            appetitesList: [
                "Pura destruição",
                "Poder sobre outras pessoas",
                "Prazeres mortais",
                "Conquista",
                "Riquezas e propriedades",
                "Fama e glória"
            ],
            appetiteEffect: "Enquanto estiver perseguindo um de seus apetites, se realizar algum movimento, no lugar de rolar 2d6 você rola 1d6+1d8. Se o d6 apresentar o maior resultado do par, o MJ também irá introduzir uma complicação ou perigo que surge a partir de sua busca implacável."
        },
        {
            id: "o_que_voce_esta_esperando",
            name: "O Que Você Está Esperando?",
            trigger: "Quando gritar um desafio para seus inimigos",
            description: "Quando gritar um desafio para seus inimigos, role+CON.",
            attribute: "con",
            results: {
                success: "Com 10+, eles passam a lhe tratar como a ameaça mais óbvia a ser enfrentada, ignorando os seus companheiros, e você recebe +2 de dano constante contra eles.",
                partial: "Com 7–9, apenas alguns (os mais fracos ou tolos dentre eles) caem em suas provocações."
            },
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "continuo_faminto",
            name: "Contínuo Faminto",
            description: "Escolha um apetite adicional.",
            grantsExtraAppetite: true
        },
        {
            id: "sempre_em_frente",
            name: "Sempre em Frente",
            description: "Quando desafiar o perigo causado por algum movimento, receba +1."
        },
        {
            id: "khan_khans",
            name: "Khan dos Khans",
            description: "Seus lacaios sempre aceitam a satisfação gratuita de um apetite seu como pagamento."
        },
        {
            id: "sansao",
            name: "Sansão",
            description: "Você pode aceitar uma debilidade para imediatamente se livrar de qualquer restrição física ou mental."
        },
        {
            id: "usurpador",
            name: "Usurpador",
            description: "Quando se provar superior a uma pessoa no poder, receba +1 adiante contra seus seguidores, lacaios e puxa-sacos."
        },
        {
            id: "percepcao_pontos_fracos",
            name: "Percepção de Pontos Fracos",
            description: "Quando discernir realidades, acrescente \"o que aqui é fraco ou vulnerável?\" à lista de perguntas que você pode fazer."
        },
        {
            id: "apetite_destruicao",
            name: "Apetite Por Destruição",
            description: "Pegue um movimento da lista do guerreiro, bardo ou ladrão. Você não pode pegar os movimentos de multiclasse dessas classes.",
            allowsMulticlass: true,
            multiclassFrom: ["guerreiro", "bardo", "ladrao"]
        },
        {
            id: "meu_amor_caminhao",
            name: "Meu Amor Por Você É Como um Caminhão",
            description: "Quando realizar um feito de força, nomeie alguém presente que tenha ficado impressionado por ele, e receba +1 adiante para negociar com essa pessoa."
        },
        {
            id: "melhores_coisas_vida",
            name: "As Melhores Coisas da Vida",
            description: "No final da sessão, se tiver esmagado seus inimigos, vê-los fugir diante de sua presença e ouvir os lamentos de seus parentes, marque XP.",
            grantsXP: true,
            xpTrigger: "Esmagar inimigos, vê-los fugir e ouvir lamentos"
        },
        {
            id: "grande_viajante",
            name: "Grande Viajante",
            description: "Você já empreendeu jornadas por todos os lugares do mundo. Quando chegar em algum lugar, pergunte ao MJ a respeito de tradições importantes, rituais e similares, e ele lhe dirá o que precisa saber."
        },
        {
            id: "esmagar",
            name: "Esmagar!",
            trigger: "Quando matar e pilhar",
            description: "Quando matar e pilhar, com 12+, cause seu dano e escolha algum objeto físico que seu alvo possua (uma arma, sua posição, um membro): ele perde o objeto escolhido."
        },
        {
            id: "fome_indestrutivel",
            name: "Fome Indestrutível",
            description: "Quando for receber dano, você pode optar por receber -1 constante até saciar um de seus apetites no lugar do dano. Você não poderá escolher esta opção enquanto estiver com essa penalidade ativa."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "otimo_dia_morrer",
            name: "Um Ótimo Dia Para Morrer",
            description: "Enquanto tiver menos PV do que sua CON (ou 1, o que for maior), receba +1 constante."
        },
        {
            id: "aquele_bate_porta",
            name: "Aquele Que Bate à Porta",
            description: "Quando desafiar o perigo, com 12+ você vira o perigo de volta contra ele mesmo. O MJ lhe descreverá como."
        },
        {
            id: "desconfianca_saudavel",
            name: "Desconfiança Saudável",
            description: "Sempre que a magia impura manipulada por homens mortais o obrigar a desafiar o perigo, trate qualquer resultado de 6− como se fosse 7–9."
        },
        {
            id: "mate_todos",
            name: "Mate a Todos",
            requires: "Apetite Por Destruição",
            description: "Pegue mais um movimento da lista do guerreiro, bardo ou ladrão. Você não pode pegar os movimentos de multiclasse dessas classes.",
            allowsMulticlass: true,
            multiclassFrom: ["guerreiro", "bardo", "ladrao"]
        },
        {
            id: "mais_sempre_mais",
            name: "Mais! Sempre Mais!",
            description: "Quando satisfizer um de seus apetites de forma extrema (destruindo algo único e significante, ganhando uma fama, riqueza ou poder enormes, etc.) você pode optar por resolvê-lo permanentemente. Risque-o de sua lista e marque XP. Apesar de poder buscar aquele apetite novamente, você não sente mais o desejo ardente que uma vez sentiu. Em seu lugar, escolha um novo apetite da lista ou escreva seu próprio.",
            grantsXP: true,
            xpTrigger: "Satisfazer um apetite de forma extrema e resolvê-lo permanentemente"            
        },
        {
            id: "marca_poder",
            name: "Marca de Poder",
            description: "Quando adquirir este movimento e gastar algum tempo ininterrupto refletindo a respeito de suas glórias passadas, você poderá se marcar com um símbolo de seu poder (uma longa trança amarrada com sinos, tatuagens ou cicatrizes rituais, etc.). Qualquer criatura mortal inteligente que enxergue o símbolo saberá instintivamente que você é uma força a ser reconhecida, e o tratará de acordo."
        },
        {
            id: "grito_guerra",
            name: "Grito de Guerra",
            trigger: "Quando entrar na batalha fazendo uma demonstração de força",
            description: "Quando entrar na batalha fazendo uma demonstração de força (um urro, um grito encorajador, uma dança de batalha), role+CAR.",
            attribute: "car",
            results: {
                success: "Com 10+, ambos.",
                partial: "Com 7–9, escolha um ou outro."
            },
            options: [
                "Seus aliados são encorajados e recebem +1 adiante",
                "Seus inimigos sentirão medo e agirão de acordo (evitando-o, escondendo-se, atacando com abandono direcionado pelo medo)"
                ]
        },
        {
            id: "pelo_deus_sangue",
            name: "Pelo Deus do Sangue",
            trigger: "Quando sacrificar essas coisas em seus ritos e rituais",
            description: "Você foi iniciado nos velhos caminhos, os caminhos do sacrifício. Escolha alguma coisa que seus deuses (ou espíritos ancestrais, totem, etc.) valorizem — ouro, sangue, ossos ou coisa do gênero. Quando sacrificar essas coisas em seus ritos e rituais, role+SAB.",
            attribute: "sab",
            results: {
                success: "Com 10+, o MJ lhe concederá algum conhecimento a respeito dos seus problemas atuais, ou uma bênção que irá ajudá-lo.",
                partial: "Com 7–9, o sacrifício não foi suficiente, e seus deuses exigem também que você ofereça sua carne, mas ainda lhe concedem o conhecimento ou a bênção.",
                fail: "Com 6−, você consegue apenas a ira dos espíritos volúveis."
            },
            requiresSacrificeChoice: true            
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_BARBARO = CLASS_BARBARO;
}


