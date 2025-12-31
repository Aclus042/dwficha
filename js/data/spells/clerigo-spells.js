/**
 * =====================================================
 * DUNGEON WORLD - GRIMÓRIO DO CLÉRIGO
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLERIGO_SPELLS = {
    // Informação sobre orações
    oracoesInfo: "Sempre que comungar, você recebe acesso a todas as suas orações sem precisar escolhê-las ou considerá-las em seu limite de feitiços.",
    
    // ORAÇÕES (sempre disponíveis, não contam no limite)
    oracoes: [
        {
            id: "santificar",
            name: "Santificar",
            level: 0,
            type: "oracao",
            description: "Qualquer comida ou água que estiver em suas mãos enquanto conjura este feitiço será consagrada por sua divindade. Além de se tornar sagrada ou profana, a substância afetada é purificada de qualquer resíduo mundano."
        },
        {
            id: "guia",
            name: "Guia",
            level: 0,
            type: "oracao",
            description: "O símbolo da sua divindade surge à sua frente e aponta na direção ou curso de ação que seu deus gostaria que você tomasse, desaparecendo logo em seguida. Esta mensagem é passada apenas através de movimentos – a comunicação permitida por este feitiço é extremamente limitada."
        },
        {
            id: "luz",
            name: "Luz",
            level: 0,
            type: "oracao",
            description: "Uma luz divina se acende no item tocado por você, tão brilhante quando uma tocha. Ela não emite calor ou som e não precisa de combustível, mas funciona como uma tocha comum para todos os outros efeitos. Você possui total controle sobre a cor dessa luz. Ela continua ativa enquanto permanecer em sua presença."
        }
    ],
    
    // FEITIÇOS DE 1º NÍVEL
    nivel1: [
        {
            id: "curar_ferimentos_leves",
            name: "Curar Ferimentos Leves",
            level: 1,
            type: "feitico",
            ongoing: false,
            description: "Sob seu toque, ferimentos se cicatrizam e ossos deixam de doer. Cure 1d8 de dano em um aliado que você tocar."
        },
        {
            id: "falar_com_os_mortos",
            name: "Falar com os Mortos",
            level: 1,
            type: "feitico",
            ongoing: false,
            description: "Um cadáver dialoga rapidamente com você, respondendo a até três perguntas com todo o conhecimento que ele tinha em vida, e aquele que adquiriu após a morte."
        },
        {
            id: "arma_magica",
            name: "Arma Mágica",
            level: 1,
            type: "feitico",
            ongoing: true,
            description: "A arma que estiver em suas mãos no momento em que conjurar este feitiço causa +1d4 de dano até que ele seja desfeito. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "bencao",
            name: "Bênção",
            level: 1,
            type: "feitico",
            ongoing: true,
            description: "Sua divindade sorri para um combatente à sua escolha, que receberá +1 constante enquanto a batalha continuar e ele permanecer de pé lutando. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "detectar_alinhamento",
            name: "Detectar Alinhamento",
            level: 1,
            type: "feitico",
            ongoing: false,
            description: "Quando conjurar esta magia, escolha um alinhamento: Bom, Mal, Ordeiro ou Caótico. Um de seus sentidos se torna momentaneamente capaz de detectar aquele alinhamento. O MJ lhe indicará quem ou o que pertence ao alinhamento escolhido."
        },
        {
            id: "santuario",
            name: "Santuário",
            level: 1,
            type: "feitico",
            ongoing: false,
            description: "Enquanto conjura este feitiço, você caminha ao redor de uma área, demarcando seu perímetro e consagrando-a à sua divindade. Enquanto permanecer dentro da área, você será alertado de qualquer ação maliciosa que ocorrer ali dentro (incluindo uma criatura que entre no perímetro com intenções malignas). Qualquer pessoa curada dentro de um santuário recebe +1d4 PV."
        },
        {
            id: "aterrorizar",
            name: "Aterrorizar",
            level: 1,
            type: "feitico",
            ongoing: true,
            description: "Escolha um alvo que você possa enxergar e um objeto próximo. O alvo adquire pavor do objeto enquanto você mantiver este feitiço ativo, e sua reação é definida por ele: fugir, entrar em pânico, implorar, lutar. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços. Não é possível escolher como alvo uma entidade com inteligência abaixo da animal (construtos mágicos, autômatos, mortos-vivos e similares)."
        }
    ],
    
    // FEITIÇOS DE 3º NÍVEL
    nivel3: [
        {
            id: "curar_ferimentos_moderados",
            name: "Curar Ferimentos Moderados",
            level: 3,
            type: "feitico",
            ongoing: false,
            description: "Você estanca sangramentos e conserta ossos quebrados através de magia. Cure 2d8 de dano em um aliado que você tocar."
        },
        {
            id: "escuridao",
            name: "Escuridão",
            level: 3,
            type: "feitico",
            ongoing: true,
            description: "Escolha uma área que você possa enxergar: ela se enche com sombras e escuridão sobrenatural. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "prender_pessoa",
            name: "Prender Pessoa",
            level: 3,
            type: "feitico",
            ongoing: false,
            description: "Escolha uma pessoa que você possa enxergar. Até que você conjure um feitiço ou abandone sua presença, ela não poderá realizar qualquer ação a não ser falar. O efeito é cancelado imediatamente se o alvo sofrer qualquer tipo de dano."
        },
        {
            id: "ressurreicao",
            name: "Ressurreição",
            level: 3,
            type: "feitico",
            ongoing: false,
            description: "Diga ao MJ que você deseja ressuscitar um cadáver cuja alma ainda não tenha abandonado este mundo completamente. A ressurreição é sempre possível, mas o MJ lhe pedirá para cumprir uma ou mais (provavelmente todas) das condições abaixo:\n• O processo irá demorar dias/semanas/meses\n• Você precisa conseguir a ajuda de __________\n• Custará muito dinheiro\n• Você precisará sacrificar __________ para fazê-lo\nO MJ pode, de acordo com as circunstâncias, permitir que um cadáver seja ressuscitado imediatamente, e as condições impostas devem ser cumpridas para que isso seja permanente, ou ele pode exigir que as condições sejam cumpridas previamente.",
            hasInputFields: true
        },
        {
            id: "reanimar_mortos",
            name: "Reanimar os Mortos",
            level: 3,
            type: "feitico",
            ongoing: true,
            description: "Você invoca um espírito faminto para que ele possua um corpo recém falecido e torne-se seu servo. Isso cria um zumbi que segue suas ordens utilizando ao máximo suas capacidades limitadas. Trate o zumbi como se fosse um personagem, mas podendo realizar apenas movimentos básicos. Ele possui um modificador de +1 em todas as características e 1 PV. Ele recebe também 1d4 das características abaixo:\n• O zumbi é talentoso. Uma de suas características possui um modificador de +2.\n• O zumbi é durável. Ele recebe +2 PV para cada nível de seu criador.\n• O zumbi possui um cérebro que ainda funciona, e é capaz de completar tarefas complexas.\n• O zumbi não aparenta estar morto, pelo menos por um ou dois dias.\nO zumbi persiste até que seja destruído, recebendo uma quantidade de dano superior aos seus PV, ou até que você opte por encerrar o feitiço. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        }
    ],
    
    // FEITIÇOS DE 5º NÍVEL
    nivel5: [
        {
            id: "curar_ferimentos_criticos",
            name: "Curar Ferimentos Críticos",
            level: 5,
            type: "feitico",
            ongoing: false,
            description: "Cure 3d8 de dano em um aliado que você tocar."
        },
        {
            id: "adivinhacao",
            name: "Adivinhação",
            level: 5,
            type: "feitico",
            ongoing: false,
            description: "Nomeie uma pessoa, local ou objeto a respeito do qual queira obter informações. Sua divindade lhe mostrará o alvo, tão claramente quanto seria se você estivesse em sua presença."
        },
        {
            id: "revelacao",
            name: "Revelação",
            level: 5,
            type: "feitico",
            ongoing: false,
            description: "Sua divindade responde às suas preces durante um momento de perfeita compreensão. O MJ irá iluminar a situação atual. Quando agir baseado nas informações que lhe forem dadas, receba +1 adiante."
        },
        {
            id: "contagio",
            name: "Contágio",
            level: 5,
            type: "feitico",
            ongoing: true,
            description: "Escolha uma criatura que você possa enxergar. Enquanto este feitiço permanecer ativo, o alvo sofre de uma doença à sua escolha. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "palavras_silenciosos",
            name: "Palavras dos Silenciosos",
            level: 5,
            type: "feitico",
            ongoing: false,
            description: "Com um simples toque, você se torna capaz de conversar com os espíritos presentes no interior de todas as coisas. O objeto inanimado que você tocar lhe responde até três perguntas, no máximo de sua capacidade."
        },
        {
            id: "visao_verdadeira",
            name: "Visão Verdadeira",
            level: 5,
            type: "feitico",
            ongoing: true,
            description: "Sua visão se abre para a verdadeira natureza de tudo o que estiver enxergando, atravessando ilusões e encontrando coisas ocultas. O MJ lhe descreverá o local, ignorando todas as ilusões e falsificações, sejam elas mágicas ou não. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "aprisionar_alma",
            name: "Aprisionar Alma",
            level: 5,
            type: "feitico",
            ongoing: false,
            description: "Você aprisiona a alma de uma criatura agonizante em uma gema. A criatura estará ciente de seu aprisionamento, mas ainda pode ser manipulada através de feitiços, negociação e outros efeitos. Todos os movimentos realizados contra ela receberão +1. Você pode libertar a alma a qualquer momento, mas ela jamais poderá ser capturada novamente."
        }
    ],
    
    // FEITIÇOS DE 7º NÍVEL
    nivel7: [
        {
            id: "restauracao",
            name: "Restauração",
            level: 7,
            type: "feitico",
            ongoing: false,
            description: "Ao tocar um aliado, ele é curado de uma quantidade de dano igual ao seu próprio valor máximo de PV."
        },
        {
            id: "destruicao",
            name: "Destruição",
            level: 7,
            type: "feitico",
            ongoing: false,
            description: "Toque um inimigo e atinja-o com fúria divina – cause 2d8 de dano a ele e 1d6 de dano a você mesmo. Esses danos ignoram armaduras."
        },
        {
            id: "sinal_morte",
            name: "Sinal da Morte",
            level: 7,
            type: "feitico",
            ongoing: false,
            description: "Escolha uma criatura cujo nome verdadeiro você conheça. Este feitiço cria runas permanentes em uma superfície alvo, que matarão aquela criatura caso ela as leia."
        },
        {
            id: "controlar_clima",
            name: "Controlar o Clima",
            level: 7,
            type: "feitico",
            ongoing: false,
            description: "Faça uma prece pedindo por chuva – ou sol, ou vento, ou neve. Dentro de aproximadamente um dia, seu deus irá respondê-lo, alterando o clima conforme seu pedido durante alguns dias."
        },
        {
            id: "palavra_retorno",
            name: "Palavra de Retorno",
            level: 7,
            type: "feitico",
            ongoing: false,
            description: "Escolha uma palavra. Quando pronunciá-la pela primeira vez após conjurar este feitiço, você e qualquer aliado que o estiver tocando no momento da conjuração serão imediatamente transportados para o local onde este feitiço foi conjurado. É possível manter apenas uma única localidade: conjurar Palavra de Retorno novamente antes de pronunciar a palavra substitui o feitiço anterior."
        },
        {
            id: "amputar",
            name: "Amputar",
            level: 7,
            type: "feitico",
            ongoing: true,
            description: "Escolha um membro do alvo, como um braço, um tentáculo ou uma asa – ele será magicamente separado de seu corpo, sem causar danos, mas provocando uma dor considerável. A perda do membro pode, por exemplo, impedir uma criatura alada de voar, ou um touro de perfurá-lo com seus chifres. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        }
    ],
    
    // FEITIÇOS DE 9º NÍVEL
    nivel9: [
        {
            id: "tempestade_vinganca",
            name: "Tempestade da Vingança",
            level: 9,
            type: "feitico",
            ongoing: false,
            description: "Sua divindade faz com que um clima sobrenatural à sua escolha surja. Chuva de sangue ou de ácido, nuvens de almas, ventos que podem levar prédios, ou qualquer outro tipo de clima que você consiga imaginar: peça e ele virá."
        },
        {
            id: "reparos",
            name: "Reparos",
            level: 9,
            type: "feitico",
            ongoing: false,
            description: "Escolha um evento ocorrido no passado de seu alvo. Todos os efeitos daquele evento, incluindo danos, venenos, doenças e efeitos mágicos são imediatamente encerrados e reparados. PV e doenças são curados, venenos neutralizados, efeitos mágicos cancelados."
        },
        {
            id: "praga",
            name: "Praga",
            level: 9,
            type: "feitico",
            ongoing: true,
            description: "Nomeie uma cidade, aldeia, acampamento ou outro local onde vivam pessoas. Enquanto este feitiço permanecer ativo, aquele lugar será tomado por uma praga apropriada aos domínios de sua divindade (gafanhotos, morte do primogênito, etc.). Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        },
        {
            id: "consumir_morte_vida",
            name: "Consumir Morte-Vida",
            level: 9,
            type: "feitico",
            ongoing: false,
            description: "Um morto-vivo sem mente que for tocado por você será imediatamente destruído, e sua energia necromântica será utilizada para curá-lo ou ao próximo aliado que você tocar por uma quantidade de Pontos de Vida igual aos PV que a criatura possuía antes de ser destruída."
        },
        {
            id: "presenca_divina",
            name: "Presença Divina",
            level: 9,
            type: "feitico",
            ongoing: true,
            description: "Todas as criaturas são obrigadas a pedir sua permissão para permanecerem em sua presença, e você deve concedê-la em voz alta. Qualquer criatura sem a sua permissão sofrerá 1d10 de dano extra sempre que sofrer dano em sua presença. Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços."
        }
    ]
};

// Funções auxiliares
const ClerigoSpellsHelper = {
    /**
     * Retorna todos os feitiços organizados por nível
     */
    getAllByLevel() {
        return {
            oracoes: CLERIGO_SPELLS.oracoes,
            nivel1: CLERIGO_SPELLS.nivel1,
            nivel3: CLERIGO_SPELLS.nivel3,
            nivel5: CLERIGO_SPELLS.nivel5,
            nivel7: CLERIGO_SPELLS.nivel7,
            nivel9: CLERIGO_SPELLS.nivel9
        };
    },
    
    /**
     * Retorna feitiços disponíveis para um determinado nível de personagem
     */
    getAvailableForLevel(characterLevel) {
        const available = {
            oracoes: CLERIGO_SPELLS.oracoes,
            nivel1: CLERIGO_SPELLS.nivel1
        };
        
        if (characterLevel >= 3) {
            available.nivel3 = CLERIGO_SPELLS.nivel3;
        }
        if (characterLevel >= 5) {
            available.nivel5 = CLERIGO_SPELLS.nivel5;
        }
        if (characterLevel >= 7) {
            available.nivel7 = CLERIGO_SPELLS.nivel7;
        }
        if (characterLevel >= 9) {
            available.nivel9 = CLERIGO_SPELLS.nivel9;
        }
        
        return available;
    },
    
    /**
     * Calcula o limite de níveis de feitiço baseado no nível do personagem
     */
    getSpellLimit(characterLevel) {
        return characterLevel + 1;
    },
    
    /**
     * Retorna um feitiço específico por ID
     */
    getSpellById(spellId) {
        const allSpells = [
            ...CLERIGO_SPELLS.oracoes,
            ...CLERIGO_SPELLS.nivel1,
            ...CLERIGO_SPELLS.nivel3,
            ...CLERIGO_SPELLS.nivel5,
            ...CLERIGO_SPELLS.nivel7,
            ...CLERIGO_SPELLS.nivel9
        ];
        return allSpells.find(s => s.id === spellId);
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLERIGO_SPELLS = CLERIGO_SPELLS;
    window.ClerigoSpellsHelper = ClerigoSpellsHelper;
}
