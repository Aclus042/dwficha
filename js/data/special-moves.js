/**
 * =====================================================
 * DUNGEON WORLD - MOVIMENTOS ESPECIAIS
 * Movimentos do sistema usados em situações específicas
 * =====================================================
 * 
 * ATENÇÃO: Estes movimentos devem corresponder EXATAMENTE
 * ao texto oficial do livro Dungeon World em português.
 */

const SPECIAL_MOVES = [
    {
        id: "lastBreath",
        name: "Último Suspiro",
        trigger: "Quando você está morrendo",
        description: `Quando você está morrendo, você vislumbra o que existe além dos Portões Negros do Reino da Morte (o Mestre vai descrever isso). Então role (apenas role, +nada — a sorte é tudo o que conta aqui).`,
        results: {
            success: {
                value: "10+",
                text: "Você engana a Morte — você está em um estado terrível, mas ainda vivo."
            },
            partial: {
                value: "7-9",
                text: "A Morte vai lhe oferecer uma barganha. Aceite-a e se estabilize, ou recuse e passe pelos Portões Negros para o que vier depois."
            },
            fail: {
                value: "6-",
                text: "Seu destino está selado. Você está morto em pouco tempo. O Mestre vai lhe dizer quando; você tem tempo para palavras finais. Faça-as valer."
            }
        },
        category: "special"
    },
    {
        id: "encumbrance",
        name: "Carga",
        trigger: "Quando você faz um movimento enquanto carrega peso",
        description: `Quando você faz um movimento enquanto carrega peso, você pode estar sobrecarregado.`,
        results: {
            normal: {
                value: "Carga ≤ Carga Máxima",
                text: "Você carrega peso normalmente sem penalidade."
            },
            encumbered: {
                value: "Carga > Carga Máxima",
                text: "Você está sobrecarregado. Você tem -1 contínuo até reduzir sua carga."
            },
            overloaded: {
                value: "Carga > Carga Máxima + 2",
                text: "Você está sobrecarregado demais para se mover. Você deve largar alguma coisa para poder agir."
            }
        },
        category: "special"
    },
    {
        id: "makecamp",
        name: "Montar Acampamento",
        trigger: "Quando você se acomoda para descansar",
        description: `Quando você se acomoda para descansar, consuma uma ração. Se você estiver em algum lugar perigoso, decida a ordem de vigília. Se você tiver pelo menos uma refeição e seu descanso não for interrompido, você cura dano igual a metade do seu PV máximo.`,
        category: "special"
    },
    {
        id: "takeWatch",
        name: "Vigiar",
        trigger: "Quando você é o primeiro a notar um perigo",
        description: `Quando você é o primeiro a notar um perigo em um acampamento ou durante viagem, você pode acordar os outros.`,
        category: "special"
    },
    {
        id: "undertakePerilousJourney",
        name: "Empreender uma Jornada Perigosa",
        trigger: "Quando você viaja por território hostil",
        description: `Quando você viaja por território hostil, escolha um membro do grupo para ser o pioneiro, um para ser o batedor e um para ser o intendente. Cada um rola+SAB.`,
        results: {
            success: {
                value: "10+",
                text: "O pioneiro reduz a quantidade de rações consumidas pela metade. O batedor avista problemas antes de eles acontecerem. O intendente reduz a duração da viagem (o Mestre vai lhe dizer quanto tempo se economiza, dependendo da distância)."
            },
            partial: {
                value: "7-9",
                text: "Cada papel que role 7-9 funciona, mas o Mestre vai apresentar alguma complicação no caminho."
            },
            fail: {
                value: "6-",
                text: "Cada papel que falhe cria problema para o grupo. O Mestre vai decidir qual."
            }
        },
        category: "special"
    },
    {
        id: "levelUp",
        name: "Subir de Nível",
        trigger: "Quando você tem tempo livre e XP igual ou superior ao seu nível atual + 7",
        description: `Quando você tem tempo livre (horas ou dias) e XP igual ou superior ao seu nível atual + 7, você pode refletir sobre suas experiências e refinar suas habilidades.

• Subtraia seu nível atual + 7 do seu XP.
• Aumente seu nível em 1.
• Escolha um novo movimento avançado da sua classe.
• Se você for o Mago, você também pode adicionar uma nova magia ao seu grimório.
• Escolha uma de suas opções de atributo e aumente-a em 1 (isso pode mudar seu modificador). Mudar sua Constituição também muda seu PV máximo.`,
        category: "special"
    },
    {
        id: "endOfSession",
        name: "Fim de Sessão",
        trigger: "Quando você chega ao fim de uma sessão",
        description: `Quando você chega ao fim de uma sessão, responda a estas perguntas como um grupo:

• Aprendemos algo novo e importante sobre o mundo?
• Superamos um monstro ou inimigo notável?
• Saqueamos um tesouro memorável?

Para cada "sim", cada jogador marca XP.

Então responda estas perguntas como indivíduos:
• Meu alinhamento ditou minhas ações?
• Eu cumpri ou resolvi um vínculo?

Para cada "sim", marque XP. Então escolha um vínculo para resolver ou escrever um novo.`,
        category: "special"
    },
    {
        id: "carouse",
        name: "Festejar",
        trigger: "Quando você volta triunfante e dá uma festa memorável",
        description: `Quando você volta triunfante e dá uma festa memorável, gaste 100 moedas e role+1 para cada 100 moedas extras gastas.`,
        results: {
            success: {
                value: "10+",
                text: "Escolha 3 da lista."
            },
            partial: {
                value: "7-9",
                text: "Escolha 1 da lista."
            },
            fail: {
                value: "6-",
                text: "Você ainda escolhe 1, mas as coisas ficam fora de controle (o Mestre vai lhe dizer como)."
            }
        },
        additionalInfo: `• Você faz amizade com um PdM útil.
• Você ouve rumores de uma oportunidade.
• Você ganha informações úteis.
• Você não é enganado, atacado ou abduzido.`,
        category: "special"
    },
    {
        id: "supplyDepot",
        name: "Reabastecer",
        trigger: "Quando você vai a um lugar civilizado comprar coisas",
        description: `Quando você vai a um lugar civilizado comprar coisas, você pode comprar qualquer item comum do mercado pelo preço listado. O Mestre vai decidir o que está disponível além do comum.`,
        category: "special"
    },
    {
        id: "recover",
        name: "Recuperar-se",
        trigger: "Quando você não faz nada além de descansar em conforto e segurança",
        description: `Quando você não faz nada além de descansar em conforto e segurança, após um dia de descanso, você recupera todos os seus PV. Depois de três dias, você remove uma debilidade de sua escolha. Se você estiver sob os cuidados de um curandeiro (mágico ou não), em vez disso, você se cura de uma debilidade por dia de descanso.`,
        category: "special"
    },
    {
        id: "recruit",
        name: "Recrutar",
        trigger: "Quando você espalha que está procurando contratar ajuda",
        description: `Quando você espalha que está procurando contratar ajuda, role.
        
• +1 se você deixar claro que o pagamento é generoso
• +1 se você mencionar qual é o trabalho
• +1 se você mencionar que vai ter uma parte do tesouro
• +1 se você tiver uma reputação útil por aqui`,
        results: {
            success: {
                value: "10+",
                text: "Você encontra um recruta disponível e competente (o Mestre vai criar um PdM para você)."
            },
            partial: {
                value: "7-9",
                text: "Você encontra alguém, mas o Mestre vai escolher uma complicação: Eles exigem pagamento garantido antecipado; Eles têm exigências ultrajantes; Eles são a melhor opção que você tem — gosta deles ou não."
            },
            fail: {
                value: "6-",
                text: "Ninguém está interessado."
            }
        },
        category: "special"
    },
    {
        id: "outstandingWarrants",
        name: "Mandados Pendentes",
        trigger: "Quando você volta a um lugar civilizado onde já causou problemas",
        description: `Quando você volta a um lugar civilizado onde já causou problemas antes, role+CAR.`,
        results: {
            success: {
                value: "10+",
                text: "Está tudo bem; qualquer problema foi esquecido, encoberto ou não foi conectado a você."
            },
            partial: {
                value: "7-9",
                text: "O Mestre escolhe 1 das seguintes: Alguém está de olho em você; Você precisa pagar algum tipo de dívida; Alguém quer algo de você."
            },
            fail: {
                value: "6-",
                text: "O Mestre faz um movimento relacionado aos seus crimes."
            }
        },
        category: "special"
    },
    {
        id: "bolster",
        name: "Reforçar",
        trigger: "Quando você gasta seu tempo livre estudando, meditando ou treinando",
        description: `Quando você gasta seu tempo livre estudando, meditando ou treinando intensamente, você ganha preparação. Se você se preparar por uma semana ou duas, retenha 1 preparação. Se você se preparar por um mês ou mais, retenha 3 preparação.

Quando sua preparação se aplicar ao rolamento de um movimento, você pode gastar 1 preparação antes do rolamento para receber +1 ao rolamento. Você só pode gastar 1 preparação por rolamento.`,
        category: "special"
    }
];

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.SPECIAL_MOVES = SPECIAL_MOVES;
}
