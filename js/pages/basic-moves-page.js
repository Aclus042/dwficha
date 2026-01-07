/**
 * =====================================================
 * DUNGEON WORLD - DADOS DE MOVIMENTOS BÁSICOS
 * Movimentos básicos e especiais do sistema
 * Usados pela seção Referência da ficha de personagem
 * =====================================================
 */

const BasicMovesPage = {
    /**
     * Movimentos Básicos
     */
    basicMoves: [
        {
            id: 'hack-and-slash',
            name: 'Matar e Pilhar',
            trigger: 'Quando atacar um adversário em combate corpo a corpo',
            roll: 'role+FOR',
            hit: 'cause dano ao adversário e evite seu ataque. Opcionalmente, você pode causar +1d6 de dano, expondo-se ao contra ataque.',
            partial: 'cause dano ao adversário, e ele fará um ataque contra você.'
        },
        {
            id: 'volley',
            name: 'Disparar',
            trigger: 'Quando mirar uma arma e dispará-la contra um adversário à distância',
            roll: 'role+DES',
            hit: 'você conseguiu um tiro preciso - cause seu dano.',
            partial: 'escolha um (cause dano independente da escolha):',
            partialOptions: [
                'Você é forçado a se mover para conseguir uma linha de tiro, colocando-se em perigo conforme escolha do MJ;',
                'Você é forçado a disparar de qualquer jeito: -1d6 de dano;',
                'Você é forçado a disparar várias vezes, reduzindo sua munição em 1.'
            ]
        },
        {
            id: 'defy-danger',
            name: 'Desafiar o Perigo',
            trigger: 'Quando agir apesar de qualquer perigo iminente ou sofrer alguma calamidade, diga como lidará com a situação e role.',
            rollOptions: [
                '… à força, +FOR;',
                '… saindo do caminho ou agindo rápido, +DES;',
                '… resistindo, +CON;',
                '… com pensamento rápido, +INT;',
                '… pela fortitude mental, +SAB;',
                '… usando charme e trato social, +CAR.'
            ],
            hit: 'realize o que pretendia sem ser afetado pela ameaça.',
            partial: 'você tropeça, hesita, ou se contorce: o MJ lhe oferecerá um resultado pior, uma barganha difícil ou uma escolha desagradável.'
        },
        {
            id: 'defend',
            name: 'Defender',
            trigger: 'Quando se posicionar para defender uma pessoa, objeto ou lugar sob ataque',
            roll: 'role+CON',
            hit: 'domínio 3.',
            partial: 'domínio 1.',
            description: 'Enquanto permanecer na defensiva, sempre que você ou aquilo que estiver defendendo sofrer um ataque, gaste domínio para escolher uma das opções abaixo, na razão de 1 ponto de domínio por opção:',
            options: [
                'Redirecione um ataque realizado contra a pessoa, objeto ou lugar sob sua proteção para você;',
                'Reduza o efeito ou dano do ataque pela metade;',
                'Abra as defesas do atacante, oferecendo a um aliado +1 adiante contra ele;',
                'Cause ao atacante uma quantidade de dano igual ao seu nível.'
            ]
        },
        {
            id: 'spout-lore',
            name: 'Falar Difícil',
            trigger: 'Quando consultar seu conhecimento acumulado a respeito de alguma coisa',
            roll: 'role+INT',
            hit: 'o MJ lhe dirá alguma coisa interessante e útil a respeito do assunto.',
            partial: 'o MJ lhe dirá apenas alguma coisa interessante, e caberá a você torná-la útil. O MJ pode lhe perguntar "Como você sabia disso?". Diga a verdade!'
        },
        {
            id: 'discern-realities',
            name: 'Discernir Realidades',
            trigger: 'Quando inspecionar cuidadosamente uma situação ou pessoa',
            roll: 'role+SAB',
            hit: 'faça ao MJ 3 das perguntas listadas abaixo.',
            partial: 'faça 1.',
            description: 'De qualquer forma, receba +1 adiante quando agir de acordo com as respostas.',
            options: [
                'O que aconteceu aqui recentemente?',
                'O que está para acontecer aqui agora?',
                'O que eu deveria procurar por aqui?',
                'O que eu considero útil ou valioso aqui?',
                'Quem realmente está no controle aqui?',
                'O que não é realmente o que parece aqui?'
            ]
        },
        {
            id: 'parley',
            name: 'Negociar',
            trigger: 'Quando possuir alguma influência sobre personagens do MJ e quiser manipulá-los',
            roll: 'role+CAR',
            description: 'Influência quer dizer algo de que eles precisem ou queiram.',
            hit: 'eles farão o que você pedir, caso você primeiro garanta lhe conceder o que eles pedirem.',
            partial: 'eles farão o que você pede, mas exigirão alguma garantia concreta e imediata de sua promessa.'
        },
        {
            id: 'aid-or-interfere',
            name: 'Ajudar ou Interferir',
            trigger: 'Quando quiser ajudar ou atrapalhar alguém',
            roll: 'role+Vínculo que possua com essa pessoa',
            hit: 'aquele personagem recebe +1 ou -2, à sua escolha, em sua rolagem.',
            partial: 'os modificadores ainda são aplicados, mas você também se expõe ao perigo, retribuição, ou custo de sua ação.'
        }
    ],

    /**
     * Movimentos Especiais
     */
    specialMoves: [
        {
            id: 'last-breath',
            name: 'Último Suspiro',
            trigger: 'Quando estiver morrendo, vislumbre o que existe além dos Portões Negros do Reino da Morte (o MJ lhe fará uma descrição), e depois role',
            roll: 'role (simplesmente role, sem +Nada – a Morte não liga para o quão durão ou legal você é)',
            hit: 'você engana a morte – continua em uma situação difícil, mas não estará morto.',
            partial: 'a própria Morte lhe oferecerá uma barganha – aceite-a para se estabilizar, ou recuse-a e atravesse os Portões Negros para encontrar o que quer que o destino lhe tenha reservado.',
            miss: 'seu destino estará selado. Você foi marcado como propriedade da Morte e irá cruzar seus limites logo. O MJ lhe dirá quando.'
        },
        {
            id: 'encumbrance',
            name: 'Sobrecarga',
            trigger: 'Quando fizer um movimento enquanto carrega algum peso você pode estar sobrecarregado.',
            description: 'Caso o peso que você esteja carregando seja:',
            options: [
                'igual ou menor à sua Carga, você não sofrerá quaisquer penalidades',
                'igual à sua Carga+1 ou Carga+2, receba -1 constante até que alivie sua carga',
                'maior que sua Carga+2, você tem uma escolha: jogue no chão pelo menos 1 de peso e role com -1, ou falhe automaticamente'
            ]
        },
        {
            id: 'make-camp',
            name: 'Preparar Acampamento',
            trigger: 'Quando parar para descansar, consuma uma ração.',
            description: 'Se estiver em algum lugar perigoso, decida a ordem dos turnos de guarda. Se possuir XP suficiente, você pode avançar de nível. Quando acordar de algumas horas de sono ininterrupto, cure uma quantidade de dano igual à metade de seus PV máximos.'
        },
        {
            id: 'take-watch',
            name: 'Montar Guarda',
            trigger: 'Quando estiver de guarda e alguma coisa se aproximar do acampamento',
            roll: 'role+SAB',
            hit: 'você consegue acordar seus companheiros em tempo de preparar uma reação, e todos no acampamento recebem +1 adiante.',
            partial: 'você reage um pouco tarde demais – seus companheiros no acampamento serão acordados, mas não terão tempo suficiente para se preparar. Todos estarão com suas armas e armaduras, mas nada além disso.',
            miss: 'o que quer que esteja se esgueirando além do limite da luz da fogueira terá uma vantagem sobre você.'
        },
        {
            id: 'undertake-perilous-journey',
            name: 'Empreender uma Jornada Perigosa',
            trigger: 'Quando viajar por um território hostil, escolha um membro do grupo para ser o desbravador, outro para ser o batedor, e outro para ser o contramestre. Cada personagem rola+SAB.',
            hitOptions: [
                'o contramestre reduz a quantidade de rações necessárias em 1;',
                'o desbravador reduz a quantidade de tempo necessária para alcançar o destino (o MJ dirá o quanto);',
                'o batedor vai notar qualquer perigo rápido o bastante para que vocês obtenham vantagem.'
            ],
            partial: 'cada personagem desempenhará seu papel como esperado: a quantidade normal de rações será consumida, a jornada demorará o tempo esperado, e ninguém consegue surpreender o grupo, mas ninguém também será surpreendido.'
        },
        {
            id: 'end-of-session',
            name: 'Encerrar Sessão',
            trigger: 'Quando chegar ao final da sessão',
            description: 'Escolha um de seus Vínculos que lhe pareça resolvido (ou seja, que esteja completamente explorado, que tenha se tornado irrelevante, etc.). Pergunte ao jogador do personagem com o qual você compartilha o vínculo se ele concorda. Em caso positivo, marque XP e escreva um novo Vínculo com quem quiser.\n\nAssim que os Vínculos forem atualizados, observe seu alinhamento. Caso tenha agido de acordo com ele pelo menos uma vez na sessão, marque XP.\n\nEm seguida, os jogadores devem responder às três questões abaixo coletivamente:',
            options: [
                'Nós aprendemos algo novo e importante a respeito do mundo?',
                'Nós sobrepujamos algum monstro ou inimigo notável?',
                'Nós saqueamos algum tesouro memorável?'
            ],
            footer: 'Para cada resposta "sim", todos marcam XP.'
        },
        {
            id: 'level-up',
            name: 'Avançar de Nível',
            trigger: 'Quando estiver em inatividade (por horas ou dias) e possuir uma quantidade de XP igual (ou superior) ao seu nível atual + 7, você poderá refletir a respeito de suas experiências e aperfeiçoar suas habilidades.',
            options: [
                'Subtraia seu nível atual + 7 de seu XP;',
                'Aumente seu nível em 1;',
                'Escolha um novo movimento avançado de sua classe;',
                'Se for o Mago, também poderá adicionar uma nova magia ao seu grimório;',
                'Escolha uma de suas Habilidades e a aumente em 1 (isso pode também aumentar seu modificador). Mudar sua Constituição também aumenta seus PV máximos e atuais. Valores de habilidades não podem ultrapassar 18.'
            ]
        },
        {
            id: 'carouse',
            name: 'Farrear',
            trigger: 'Quando retornar triunfante e fizer uma grande festa, gaste 100 moedas e role+1 para cada 100 moedas extras gastas.',
            hit: 'escolha 3.',
            partial: 'escolha 1.',
            miss: 'ainda escolha 1, mas as coisas vão sair totalmente de controle (o MJ dirá como).',
            options: [
                'Torne-se amigo de um PNJ útil;',
                'Você ouve rumores a respeito de uma boa oportunidade;',
                'Você adquire informações úteis;',
                'Você não é preso, enfeitiçado ou enganado.'
            ]
        },
        {
            id: 'supply',
            name: 'Abastecer',
            trigger: 'Quando for comprar alguma coisa com ouro, caso seja algo facilmente disponível no local onde você se encontra, compre a preço de mercado.',
            description: 'Se for algo especial, além do que está normalmente disponível, ou não mundano:',
            roll: 'role+CAR',
            hit: 'você encontra o que está procurando a um preço justo.',
            partial: 'você precisa pagar mais que o necessário, ou se contentar com algo que não é exatamente o que está procurando, mas quase. O MJ lhe dirá quais são suas opções.'
        },
        {
            id: 'recover',
            name: 'Recuperar-se',
            trigger: 'Quando não fizer nada além de descansar confortavelmente em segurança',
            description: 'Após um dia de descanso, recupere todos os seus PV. Após 3 dias de descanso, remova uma debilidade à sua escolha. Se estiver sob os cuidados de um curandeiro (mágico ou não), então cure uma debilidade a cada dois dias de descanso.'
        },
        {
            id: 'recruit',
            name: 'Recrutar',
            trigger: 'Quando espalhar por aí que está procurando um ajudante para contratar, role:',
            rollOptions: [
                '+1 se disser que o pagamento é generoso;',
                '+1 se disser exatamente o que pretende fazer;',
                '+1 se disser que ficarão com uma parte do que for encontrado;',
                '+1 se sua reputação for boa por essas bandas.'
            ],
            hit: 'você consegue vários interessados habilidosos, escolhe quem vai contratar, e não recebe qualquer penalidade se não quiser levá-los consigo.',
            partial: 'você terá que se contentar com alguém perto do que queria, ou mandá-los embora.',
            miss: 'alguém influente, porém bastante incapaz, dirá que quer acompanhá-lo (um jovem corajoso, alguém com um parafuso solto, ou um inimigo secreto, por exemplo). Leve-o e aguente as consequências ou mande-o embora. Caso mande algum interessado embora, receba -1 adiante para recrutar.'
        },
        {
            id: 'outstanding-warrants',
            name: 'Mandados Pendentes',
            trigger: 'Quando retornar a um local civilizado no qual tenha causado problemas anteriormente',
            roll: 'role+CAR',
            hit: 'todos já ouviram falar de seus atos e você é facilmente reconhecido.',
            partial: 'o mesmo acontece, porém o MJ escolhe uma complicação:',
            partialOptions: [
                'O xerife local tem um mandado para sua prisão;',
                'Alguém colocou um preço em sua cabeça;',
                'Alguém importante para você está em uma situação difícil como resultado de suas ações.'
            ]
        },
        {
            id: 'bolster',
            name: 'Preparar',
            trigger: 'Quando gastar seu tempo estudando, meditando ou praticando intensamente, você recebe preparo.',
            description: 'Caso se prepare por uma semana ou duas, receba 1 de preparo. Caso se prepare por 1 mês ou mais, receba 3.\n\nQuando toda essa preparação valer a pena, gaste 1 de preparo para receber +1 em um rolamento qualquer. Você somente pode gastar 1 de preparo por rolagem.'
        }
    ]
};

// Exporta globalmente
if (typeof window !== 'undefined') {
    window.BasicMovesPage = BasicMovesPage;
}
