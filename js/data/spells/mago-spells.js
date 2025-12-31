/**
 * =====================================================
 * DUNGEON WORLD - GRIMÓRIO DO MAGO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const MAGO_SPELLS = {
    // Informação sobre truques
    truquesInfo: "Você prepara todos os seus truques sempre que preparar feitiços, sem precisar selecioná-los ou contá-los contra seu limite.",
    
    // TRUQUES (Cantrips) - sempre disponíveis, não contam no limite
    truques: [
        {
            id: "luz",
            name: "Luz",
            level: 0,
            type: "truque",
            tags: ["Truque"],
            description: "Um item tocado por você brilha com luz arcana, com a mesma intensidade de uma tocha. Essa luz não emite calor ou som e nem precisa de combustível para queimar, mas funciona como uma tocha comum para todos os outros efeitos. Você possui total controle sobre a cor da luz. O feitiço dura enquanto o item estiver em sua presença."
        },
        {
            id: "servo_invisivel",
            name: "Servo Invisível",
            level: 0,
            type: "truque",
            tags: ["Truque", "Contínuo"],
            ongoing: true,
            description: "Este feitiço conjura um construto invisível simples que não é capaz de fazer nada a não ser carregar itens. Ele possui Carga 3 e consegue carregar qualquer coisa que você entregar a ele, mas não é capaz de ir buscar objetos por conta própria. Qualquer coisa carregada por um servo invisível parece flutuar no ar alguns passos atrás do mago. Caso o servo receba dano ou saia de sua presença, ele se desfaz imediatamente. De outra forma, ele o serve até que o feitiço seja encerrado."
        },
        {
            id: "prestidigitacao",
            name: "Prestidigitação",
            level: 0,
            type: "truque",
            tags: ["Truque"],
            description: "Você é capaz de fazer algumas peripécias com sua magia. Se tocar um item durante a conjuração deste truque, você poderá fazer alterações cosméticas a ele: limpá-lo, sujá-lo, resfriá-lo, aquecê-lo, mudar seu sabor ou sua cor. Se conjurar este feitiço sem tocar um item, poderá invocar pequenas ilusões, cujo tamanho não ultrapasse o seu. As imagens criadas por Prestidigitação são simples e obviamente ilusórias – elas não enganarão ninguém, mas poderão entreter as pessoas."
        }
    ],
    
    // FEITIÇOS DE 1º NÍVEL
    nivel1: [
        {
            id: "misseis_magicos",
            name: "Mísseis Mágicos",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Evocação"],
            school: "Evocação",
            ongoing: false,
            damage: "2d4",
            description: "Projéteis de pura magia são disparados das pontas de seus dedos. Cause 2d4 de dano a um alvo."
        },
        {
            id: "detectar_magia",
            name: "Detectar Magia",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Adivinhação"],
            school: "Adivinhação",
            ongoing: false,
            description: "Um dos seus sentidos torna-se momentaneamente sintonizado com a magia. O MJ lhe dirá o que é mágico ao seu redor."
        },
        {
            id: "telepatia",
            name: "Telepatia",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Adivinhação", "Contínuo"],
            school: "Adivinhação",
            ongoing: true,
            description: "Você forma um elo telepático com uma única pessoa que tocar, permitindo que conversem através de seus pensamentos. Só é possível formar um elo telepático por vez."
        },
        {
            id: "encantar_pessoa",
            name: "Encantar Pessoa",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Encantamento", "Contínuo"],
            school: "Encantamento",
            ongoing: true,
            description: "A pessoa (não funciona com animais ou monstros) que você tocar durante a conjuração deste feitiço lhe considerará como um amigo até que sofra algum dano ou que você a prove do contrário."
        },
        {
            id: "alarme",
            name: "Alarme",
            level: 1,
            type: "feitico",
            tags: ["Nível 1"],
            ongoing: false,
            description: "Ande ao redor de uma área circular. Até que você prepare feitiços novamente, este feitiço irá alertá-lo caso uma criatura entre no círculo. Mesmo que esteja dormindo, o feitiço lhe despertará de seu sono."
        },
        {
            id: "invisibilidade",
            name: "Invisibilidade",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Ilusão", "Contínuo"],
            school: "Ilusão",
            ongoing: true,
            description: "Toque um aliado: ninguém será mais capaz de vê-lo, pois ele fica invisível! Este feitiço permanece ativo até que seu alvo ataque ou que você o desfaça. Enquanto este feitiço continuar ativo, você não poderá conjurar um novo feitiço."
        },
        {
            id: "contatar_espiritos",
            name: "Contatar Espíritos",
            level: 1,
            type: "feitico",
            tags: ["Nível 1", "Invocação"],
            school: "Invocação",
            ongoing: false,
            description: "Diga o nome do espírito que deseja contatar (ou deixe isso a cargo do MJ). Você o atrai através dos planos, até que esteja próximo o suficiente para conversarem. Ele é obrigado a responder a uma questão que você perguntar da melhor forma possível."
        }
    ],
    
    // FEITIÇOS DE 3º NÍVEL
    nivel3: [
        {
            id: "bola_de_fogo",
            name: "Bola de Fogo",
            level: 3,
            type: "feitico",
            tags: ["Nível 3", "Evocação"],
            school: "Evocação",
            ongoing: false,
            damage: "2d6",
            damageNote: "ignora armadura",
            description: "Você evoca uma poderosa esfera de chamas que envolve seu alvo e todas as pessoas próximas a ele, causando 2d6 pontos de dano que ignoram armadura."
        },
        {
            id: "sono",
            name: "Sono",
            level: 3,
            type: "feitico",
            tags: ["Nível 3", "Encantamento"],
            school: "Encantamento",
            ongoing: false,
            description: "1d4 inimigos em seu campo de visão, à escolha do MJ, caem no sono. Apenas criaturas capazes de dormir são afetadas. Elas podem acordar normalmente: com barulhos altos, sacudidas ou sofrendo dor."
        },
        {
            id: "desfazer_magia",
            name: "Desfazer Magia",
            level: 3,
            type: "feitico",
            tags: ["Nível 3"],
            ongoing: false,
            description: "Escolha um feitiço ou efeito mágico em sua presença: ele será destroçado por este feitiço. Magias menores são encerradas, enquanto efeitos poderosos são apenas reduzidos ou anulados enquanto o mago permanecer por perto."
        },
        {
            id: "imagem_espelhada",
            name: "Imagem Espelhada",
            level: 3,
            type: "feitico",
            tags: ["Nível 3", "Ilusão"],
            school: "Ilusão",
            ongoing: false,
            description: "Você cria uma imagem ilusória de si próprio. Quando sofrer um ataque, role 1d6. Em um resultado 4, 5 ou 6 o ataque acerta a ilusão, e quando isso ocorrer, a imagem se dissipa e este feitiço se encerra."
        },
        {
            id: "imitacao",
            name: "Imitação",
            level: 3,
            type: "feitico",
            tags: ["Nível 3", "Contínuo"],
            ongoing: true,
            description: "Você assume a forma de alguém que tocar durante a conjuração deste feitiço. Suas características físicas serão perfeitamente copiadas, mas seu comportamento não. A mudança persiste até que você sofra dano ou opte por retornar à sua forma original. Enquanto este feitiço permanecer ativo, perca acesso a todos os seus movimentos de mago."
        },
        {
            id: "visoes_tempo",
            name: "Visões Através do Tempo",
            level: 3,
            type: "feitico",
            tags: ["Nível 3", "Adivinhação"],
            school: "Adivinhação",
            ongoing: false,
            description: "Conjure este feitiço ao observar uma superfície reflexiva para enxergar as profundezas do tempo. O MJ lhe revelará os detalhes de um portento terrível – um evento sinistro que ocorrerá se você não intervir. Ele também proverá informações úteis a respeito de maneiras através das quais você poderá interferir nos resultados do portento terrível. Raras serão as previsões que resultarão em \"e você viverá feliz para sempre\". Desculpe."
        }
    ],
    
    // FEITIÇOS DE 5º NÍVEL
    nivel5: [
        {
            id: "contatar_outros_planos",
            name: "Contatar Outros Planos",
            level: 5,
            type: "feitico",
            tags: ["Nível 5", "Adivinhação"],
            school: "Adivinhação",
            ongoing: false,
            description: "Você encaminha um chamado para outro plano. Especifique o que gostaria de contatar através de localização, tipo de criatura, nome ou título. Isso abre um canal de comunicação de mão dupla entre o conjurador e a entidade contatada, que pode ser encerrado a qualquer momento por qualquer de seus participantes."
        },
        {
            id: "metamorfose",
            name: "Metamorfose",
            level: 5,
            type: "feitico",
            tags: ["Nível 5", "Encantamento"],
            school: "Encantamento",
            ongoing: false,
            description: "Seu toque pode remodelar totalmente uma criatura, que permanecerá na forma que você criou até que você conjure um novo feitiço. Descreva ao MJ a nova forma que você dará ao alvo, incluindo mudanças em habilidades, adaptações significativas, ou fraquezas. O MJ também lhe dirá uma das coisas abaixo:",
            options: [
                "A forma será instável e temporária",
                "A mente da criatura também será alterada",
                "A forma possui alguma vantagem ou fraqueza não considerada"
            ]
        },
        {
            id: "jaula",
            name: "Jaula",
            level: 5,
            type: "feitico",
            tags: ["Nível 5", "Evocação", "Contínuo"],
            school: "Evocação",
            ongoing: true,
            description: "O alvo é preso em uma jaula de força mágica. Nada pode entrar ou sair, e ela permanece ativa até que você a desfaça ou conjure um novo feitiço. Enquanto este feitiço permanecer ativo, a criatura aprisionada pode ouvir seus pensamentos e você deve permanecer na presença da jaula."
        },
        {
            id: "invocar_monstro",
            name: "Invocar Monstro",
            level: 5,
            type: "feitico",
            tags: ["Nível 5", "Invocação", "Contínuo"],
            school: "Invocação",
            ongoing: true,
            description: "Um monstro surge e passa a auxiliá-lo da melhor forma possível. Trate-o como se fosse seu próprio personagem, mas com acesso apenas aos movimentos básicos. A criatura possui um modificador de +1 em todas as habilidades, 1 PV e utiliza o seu dado de dano. O monstro também receberá 1d6 características da lista abaixo.",
            options: [
                "O monstro possui +2 no lugar de +1 em uma habilidade",
                "O monstro não é descuidado",
                "O monstro causa 1d8 de dano",
                "A ligação do monstro com este plano é forte. +2 PV para cada nível do mago que o conjurou",
                "O monstro possui alguma adaptação útil"
            ],
            spellNote: "O MJ lhe dirá o que é a criatura, baseando-se em suas escolhas. A criatura permanece neste plano até ser morta ou até que você a libere. Enquanto este feitiço permanecer ativo, você recebe -1 em conjurar feitiços."
        }
    ],
    
    // FEITIÇOS DE 7º NÍVEL
    nivel7: [
        {
            id: "enxergar_verdade",
            name: "Enxergar a Verdade",
            level: 7,
            type: "feitico",
            tags: ["Nível 7", "Adivinhação", "Contínuo"],
            school: "Adivinhação",
            ongoing: true,
            description: "Você consegue enxergar todas as coisas como elas realmente são. O efeito persiste até que você diga uma mentira ou desfaça o feitiço. Enquanto este feitiço permanecer ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "dominacao",
            name: "Dominação",
            level: 7,
            type: "feitico",
            tags: ["Nível 7", "Encantamento", "Contínuo"],
            school: "Encantamento",
            ongoing: true,
            hasHoldSystem: true,
            holdName: "domínio",
            holdDice: "1d4",
            description: "Com um toque, você força sua mente sobre a de outra pessoa. Receba 1d4 de domínio. Gaste 1 domínio para fazer seu alvo executar uma das ações abaixo:",
            holdOptions: [
                "Falar algumas palavras de sua escolha",
                "Lhe entregar algo que esteja em poder dele",
                "Fazer um ataque contra um alvo de sua escolha",
                "Responder uma pergunta honestamente"
            ],
            spellNote: "Se ficar sem domínio, o feitiço é encerrado. Se o alvo sofrer dano, você perde 1 de domínio. Enquanto este feitiço permanecer ativo, você não pode conjurar feitiços."
        },
        {
            id: "nuvem_mortal",
            name: "Nuvem Mortal",
            level: 7,
            type: "feitico",
            tags: ["Nível 7", "Invocação", "Contínuo"],
            school: "Invocação",
            ongoing: true,
            damage: "1d6",
            damageNote: "ignora armadura",
            description: "Uma nuvem se arrasta até este mundo, vinda de além dos Portões Negros da Morte, preenchendo a área onde o mago se encontra. Sempre que uma criatura na área for ferida, ela sofre, separadamente, 1d6 de dano extra que ignora armadura. Este feitiço persiste enquanto você puder enxergar a área afetada, ou até que o desfaça."
        },
        {
            id: "caminhar_sombras",
            name: "Caminhar nas Sombras",
            level: 7,
            type: "feitico",
            tags: ["Nível 7", "Ilusão"],
            school: "Ilusão",
            ongoing: false,
            description: "As sombras afetadas por este feitiço são transformadas em portais que podem ser utilizados por você e por seus aliados. Cite um local, descrevendo-o com uma quantidade de palavras igual ou menor que seu nível. Atravessar o portal irá levar a pessoa àquele local. O portal só pode ser utilizado uma vez por cada aliado."
        },
        {
            id: "contingencia",
            name: "Contingência",
            level: 7,
            type: "feitico",
            tags: ["Nível 7", "Evocação"],
            school: "Evocação",
            ongoing: false,
            description: "Escolha um feitiço de nível 5 ou menor que você conheça. Descreva uma condição de disparo utilizando uma quantidade de palavras igual ou menor que seu nível. O feitiço escolhido ficará suspenso até que você resolva fazê-lo funcionar, ou quando a condição imposta for cumprida, o que ocorrer primeiro. Não é necessário rolar – os efeitos simplesmente acontecem. Só é possível manter um feitiço em contingência por vez – se conjurar Contingência novamente, ela substitui a conjuração anterior."
        }
    ],
    
    // FEITIÇOS DE 9º NÍVEL
    nivel9: [
        {
            id: "invocacao_perfeita",
            name: "Invocação Perfeita",
            level: 9,
            type: "feitico",
            tags: ["Nível 9", "Invocação"],
            school: "Invocação",
            ongoing: false,
            description: "Você teleporta uma criatura para sua presença. Diga o nome de uma criatura específica ou uma curta descrição de um tipo de criatura. A criatura nomeada, ou uma criatura do tipo descrito, surge diante de você."
        },
        {
            id: "alerta",
            name: "Alerta",
            level: 9,
            type: "feitico",
            tags: ["Nível 9", "Adivinhação"],
            school: "Adivinhação",
            ongoing: false,
            description: "Descreva um evento. O MJ lhe dirá quando ele ocorrer, independentemente de onde você se encontrar ou qual a sua distância até ele. Se quiser, poderá observar o local do evento como se estivesse lá. Você só pode manter um Alerta ativo de cada vez."
        },
        {
            id: "abrigo",
            name: "Abrigo",
            level: 9,
            type: "feitico",
            tags: ["Nível 9", "Evocação", "Contínuo"],
            school: "Evocação",
            ongoing: true,
            description: "Você cria uma estrutura feita inteiramente de magia pura. Ela pode ser tão grande quanto um castelo, ou tão pequena quanto uma cabana, e é totalmente invulnerável a ataques que não sejam mágicos. A estrutura permanece até que você a abandone, ou encerre o feitiço."
        },
        {
            id: "joia_alma",
            name: "Joia da Alma",
            level: 9,
            type: "feitico",
            tags: ["Nível 9"],
            ongoing: false,
            description: "Você aprisiona a alma de uma criatura moribunda em uma gema. A criatura aprisionada permanece ciente de seu aprisionamento, mas ainda assim pode ser manipulada através de magias, negociação e outros efeitos. Todos os movimentos realizados contra a criatura aprisionada recebem +1. A alma pode ser libertada a qualquer momento, mas nunca mais poderá ser recapturada."
        },
        {
            id: "antipatia",
            name: "Antipatia",
            level: 9,
            type: "feitico",
            tags: ["Nível 9", "Encantamento", "Contínuo"],
            school: "Encantamento",
            ongoing: true,
            description: "Escolha um alvo e descreva um tipo de criatura ou alinhamento. Criaturas do tipo ou alinhamento especificados não podem entrar na linha de visão do alvo. Caso elas se vejam nessa situação, fugirão imediatamente. O efeito permanece até que você saia da presença do alvo, ou desfaça o feitiço. Enquanto este feitiço permanecer ativo, você recebe -1 para conjurar feitiços."
        }
    ]
};

/**
 * Helper para obter feitiços do Mago
 */
const MagoSpellsHelper = {
    /**
     * Obtém todos os truques
     */
    getAllTruques() {
        return MAGO_SPELLS.truques;
    },
    
    /**
     * Obtém feitiços por nível
     */
    getSpellsByLevel(level) {
        const key = `nivel${level}`;
        return MAGO_SPELLS[key] || [];
    },
    
    /**
     * Obtém um feitiço específico por ID
     */
    getSpellById(spellId) {
        // Buscar nos truques
        let spell = MAGO_SPELLS.truques.find(s => s.id === spellId);
        if (spell) return spell;
        
        // Buscar nos feitiços por nível
        const levels = ['nivel1', 'nivel3', 'nivel5', 'nivel7', 'nivel9'];
        for (const level of levels) {
            spell = MAGO_SPELLS[level]?.find(s => s.id === spellId);
            if (spell) return spell;
        }
        
        return null;
    },
    
    /**
     * Obtém todos os feitiços disponíveis para um determinado nível de personagem
     */
    getAvailableSpells(characterLevel) {
        const available = {
            truques: MAGO_SPELLS.truques,
            spells: []
        };
        
        // Nível 1: pode acessar feitiços de nível 1
        // Nível 3: pode acessar feitiços de nível 1 e 3
        // etc.
        const levelAccess = [1, 3, 5, 7, 9];
        
        levelAccess.forEach(spellLevel => {
            if (characterLevel >= spellLevel) {
                const spells = MAGO_SPELLS[`nivel${spellLevel}`] || [];
                available.spells.push(...spells);
            }
        });
        
        return available;
    },
    
    /**
     * Calcula o total de níveis dos feitiços preparados
     */
    calculatePreparedTotal(preparedSpellIds) {
        let total = 0;
        
        preparedSpellIds.forEach(id => {
            const spell = this.getSpellById(id);
            if (spell && spell.level > 0) {
                total += spell.level;
            }
        });
        
        return total;
    },
    
    /**
     * Verifica se um feitiço é contínuo (ongoing)
     */
    isOngoing(spellId) {
        const spell = this.getSpellById(spellId);
        return spell?.ongoing === true;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.MAGO_SPELLS = MAGO_SPELLS;
    window.MagoSpellsHelper = MagoSpellsHelper;
}
