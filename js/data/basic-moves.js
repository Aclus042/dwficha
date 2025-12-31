/**
 * =====================================================
 * DUNGEON WORLD - MOVIMENTOS BÁSICOS
 * Movimentos disponíveis para todos os personagens
 * =====================================================
 * 
 * ATENÇÃO: Estes movimentos devem corresponder EXATAMENTE
 * ao texto oficial do livro Dungeon World em português.
 * Não modifique, adapte ou simplifique o texto.
 * 
 * Estrutura preparada para receber o conteúdo oficial.
 * Os textos aqui são placeholders que devem ser substituídos
 * pelo conteúdo exato do PDF do sistema.
 */

const BASIC_MOVES = [
    {
        id: "hackAndSlash",
        name: "Hack and Slash",
        trigger: "Quando você ataca um inimigo em combate corpo-a-corpo",
        attribute: "FOR",
        description: `Quando você ataca um inimigo em combate corpo-a-corpo, role+FOR.`,
        results: {
            success: {
                value: "10+",
                text: "Você causa seu dano ao inimigo e evita seu ataque. Você pode optar por causar +1d6 de dano, mas se expõe ao ataque do inimigo."
            },
            partial: {
                value: "7-9",
                text: "Você causa seu dano ao inimigo e o inimigo faz um ataque contra você."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        category: "basic"
    },
    {
        id: "volley",
        name: "Disparar",
        trigger: "Quando você mira e atira em um inimigo à distância",
        attribute: "DES",
        description: `Quando você mira e atira em um inimigo à distância, role+DES.`,
        results: {
            success: {
                value: "10+",
                text: "Você tem um tiro limpo — cause seu dano."
            },
            partial: {
                value: "7-9",
                text: "Escolha uma opção (qualquer que seja, você causa seu dano): Você precisa se mover para conseguir o tiro, colocando-se em perigo à escolha do Mestre; Você precisa aceitar o que consegue: -1d6 de dano; Você precisa gastar várias flechas — reduza sua munição em um."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        category: "basic"
    },
    {
        id: "defyDanger",
        name: "Desafiar o Perigo",
        trigger: "Quando você age apesar de uma ameaça iminente ou sofre uma calamidade",
        attribute: "Variável",
        description: `Quando você age apesar de uma ameaça iminente ou sofre uma calamidade, diga como você lida com isso e role. Se você faz isso...
        
• ...usando força bruta ou resistindo, role+FOR
• ...saindo do caminho ou agindo rápido, role+DES
• ...resistindo com firmeza, role+CON
• ...com engenho e artimanha, role+INT
• ...através de força mental, role+SAB
• ...usando charme e influência social, role+CAR`,
        results: {
            success: {
                value: "10+",
                text: "Você faz o que pretendia; a ameaça não se concretiza."
            },
            partial: {
                value: "7-9",
                text: "Você tropeça, hesita ou vacila: o Mestre vai lhe oferecer um resultado pior, uma barganha difícil ou uma escolha desagradável."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        category: "basic"
    },
    {
        id: "defend",
        name: "Defender",
        trigger: "Quando você se coloca em defesa de uma pessoa, item ou local sob ataque",
        attribute: "CON",
        description: `Quando você se coloca em defesa de uma pessoa, item ou local sob ataque, role+CON.`,
        results: {
            success: {
                value: "10+",
                text: "Retenha 3."
            },
            partial: {
                value: "7-9",
                text: "Retenha 1."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        additionalInfo: `Enquanto você defende, quando você ou o que você está defendendo é atacado, você pode gastar retenção, um por um, para escolher uma opção:

• Redirecione um ataque de algo que você defende para você mesmo
• Reduza pela metade o dano ou efeito do ataque
• Exponha o atacante a um aliado, dando a esse aliado +1 para um rolamento contra o atacante
• Cause dano ao atacante igual ao seu nível`,
        category: "basic"
    },
    {
        id: "spoutLore",
        name: "Discernir Realidades",
        trigger: "Quando você examina atentamente uma situação ou pessoa",
        attribute: "SAB",
        description: `Quando você examina atentamente uma situação ou pessoa, role+SAB.`,
        results: {
            success: {
                value: "10+",
                text: "Faça ao Mestre 3 perguntas da lista abaixo."
            },
            partial: {
                value: "7-9",
                text: "Faça ao Mestre 1 pergunta da lista abaixo."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        additionalInfo: `Escolha da lista:
• O que aconteceu aqui recentemente?
• O que está prestes a acontecer?
• O que devo ficar atento aqui?
• O que aqui é útil ou valioso para mim?
• Quem está realmente no controle aqui?
• O que aqui não é o que parece ser?

Receba +1 seguinte quando agir com base nas respostas.`,
        category: "basic"
    },
    {
        id: "discernRealities",
        name: "Saber das Coisas",
        trigger: "Quando você consulta seu conhecimento acumulado sobre algo",
        attribute: "INT",
        description: `Quando você consulta seu conhecimento acumulado sobre algo, role+INT.`,
        results: {
            success: {
                value: "10+",
                text: "O Mestre vai lhe dizer algo interessante e útil sobre o assunto relevante para sua situação atual."
            },
            partial: {
                value: "7-9",
                text: "O Mestre vai lhe dizer algo interessante — cabe a você torná-lo útil."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        additionalInfo: `O Mestre pode perguntar "como você sabe disso?". Diga a ele a verdade, agora.`,
        category: "basic"
    },
    {
        id: "parley",
        name: "Parlamentar",
        trigger: "Quando você tem vantagem sobre um PdM ou monstro e a manipula",
        attribute: "CAR",
        description: `Quando você tem vantagem sobre um PdM ou monstro e a manipula para que ele faça algo, role+CAR.`,
        results: {
            success: {
                value: "10+",
                text: "Ele faz o que você quer se você prometer primeiro o que ele pedir. Você pode decidir se cumpre a promessa depois."
            },
            partial: {
                value: "7-9",
                text: "Ele vai querer uma prova concreta de sua boa vontade primeiro."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        category: "basic"
    },
    {
        id: "aidOrInterfere",
        name: "Ajudar ou Atrapalhar",
        trigger: "Quando você ajuda ou atrapalha alguém",
        attribute: "Vínculo",
        description: `Quando você ajuda ou atrapalha alguém com quem você tem um vínculo, role+vínculo com esse personagem.`,
        results: {
            success: {
                value: "10+",
                text: "O personagem recebe +1 ou -2 no rolamento, sua escolha."
            },
            partial: {
                value: "7-9",
                text: "O personagem recebe +1 ou -2 no rolamento, sua escolha, mas você se expõe a perigo, retribuição ou custo."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento."
            }
        },
        category: "basic"
    }
];

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.BASIC_MOVES = BASIC_MOVES;
}
