/**
 * =====================================================
 * DUNGEON WORLD - BIBLIOTECA DE EQUIPAMENTOS
 * Base de dados de todos os itens disponíveis
 * =====================================================
 */

const EquipmentLibrary = {
    /**
     * ARMAS
     */
    weapons: [
        {
            id: 'arco-rustico',
            name: 'Arco Rústico',
            type: 'weapon',
            tags: ['próximo'],
            price: 15,
            weight: 2,
            damage: 'd6',
            description: 'Um arco simples, funcional para curtas distâncias.'
        },
        {
            id: 'arco-alta-qualidade',
            name: 'Arco de Alta Qualidade',
            type: 'weapon',
            tags: ['próximo', 'distante'],
            price: 60,
            weight: 2,
            damage: 'd6',
            description: 'Um arco bem trabalhado, eficaz em longas distâncias.'
        },
        {
            id: 'arco-cacador',
            name: 'Arco de Caçador',
            type: 'weapon',
            tags: ['próximo', 'distante'],
            price: 100,
            weight: 1,
            damage: 'd6',
            description: 'Arco leve e preciso, favorito dos caçadores experientes.'
        },
        {
            id: 'besta',
            name: 'Besta',
            type: 'weapon',
            tags: ['próximo', '+1 de dano', 'recarga'],
            price: 35,
            weight: 3,
            damage: 'd6',
            bonusDamage: 1,
            description: 'Arma poderosa que requer tempo para recarregar.'
        },
        {
            id: 'maco-flechas',
            name: 'Maço de Flechas',
            type: 'weapon',
            tags: ['munição 3'],
            price: 1,
            weight: 1,
            maxUses: 3,
            description: 'Flechas comuns para arcos e bestas.'
        },
        {
            id: 'flechas-elficas',
            name: 'Flechas Élficas',
            type: 'weapon',
            tags: ['munição 4'],
            price: 20,
            weight: 1,
            maxUses: 4,
            description: 'Flechas de fabricação élfica, leves e precisas.'
        },
        {
            id: 'clava',
            name: 'Clava / Shillelagh',
            type: 'weapon',
            tags: ['corpo a corpo'],
            price: 1,
            weight: 2,
            damage: 'd6',
            description: 'Arma primitiva mas eficaz.'
        },
        {
            id: 'cajado',
            name: 'Cajado',
            type: 'weapon',
            tags: ['corpo a corpo', 'duas mãos'],
            price: 1,
            weight: 1,
            damage: 'd6',
            description: 'Bastão versátil, útil tanto para magia quanto combate.'
        },
        {
            id: 'adaga',
            name: 'Adaga / Shiv / Faca',
            type: 'weapon',
            tags: ['mão'],
            price: 2,
            weight: 1,
            damage: 'd6',
            description: 'Lâmina curta e discreta.'
        },
        {
            id: 'adaga-arremesso',
            name: 'Adaga de Arremesso',
            type: 'weapon',
            tags: ['arremesso', 'próximo'],
            price: 1,
            weight: 0,
            damage: 'd6',
            description: 'Lâmina balanceada para arremesso.'
        },
        {
            id: 'espada-curta',
            name: 'Espada Curta / Machado / Martelo de Batalha / Maça',
            type: 'weapon',
            tags: ['corpo a corpo'],
            price: 8,
            weight: 1,
            damage: 'd6',
            description: 'Armas corpo a corpo básicas e confiáveis.'
        },
        {
            id: 'lanca',
            name: 'Lança',
            type: 'weapon',
            tags: ['alcance', 'arremesso', 'próximo'],
            price: 5,
            weight: 1,
            damage: 'd6',
            description: 'Arma versátil, boa para manter distância ou arremessar.'
        },
        {
            id: 'espada-longa',
            name: 'Espada Longa / Machado de Batalha / Mangual',
            type: 'weapon',
            tags: ['corpo a corpo', '+1 de dano'],
            price: 15,
            weight: 2,
            damage: 'd6',
            bonusDamage: 1,
            description: 'Armas de combate pesadas e poderosas.'
        },
        {
            id: 'alabarda',
            name: 'Alabarda',
            type: 'weapon',
            tags: ['alcance', '+1 de dano', 'duas mãos'],
            price: 9,
            weight: 2,
            damage: 'd6',
            bonusDamage: 1,
            description: 'Arma de haste com lâmina, excelente alcance.'
        },
        {
            id: 'florete',
            name: 'Florete',
            type: 'weapon',
            tags: ['corpo a corpo', 'preciso'],
            price: 25,
            weight: 1,
            damage: 'd6',
            description: 'Lâmina fina e ágil para espadachins habilidosos.'
        },
        {
            id: 'florete-duelo',
            name: 'Florete de Duelo',
            type: 'weapon',
            tags: ['corpo a corpo', '1 penetrante', 'preciso'],
            price: 50,
            weight: 2,
            damage: 'd6',
            piercing: 1,
            description: 'Florete de qualidade superior, ignora parte da armadura.'
        }
    ],

    /**
     * ARMADURAS
     */
    armor: [
        {
            id: 'couro',
            name: 'Couro / Cota de Malha',
            type: 'armor',
            tags: ['armadura 1', 'vestida'],
            price: 10,
            weight: 1,
            armor: 1,
            description: 'Proteção leve que não atrapalha os movimentos.'
        },
        {
            id: 'armadura-escamas',
            name: 'Armadura de Escamas',
            type: 'armor',
            tags: ['armadura 2', 'vestida', 'desengonçada'],
            price: 50,
            weight: 3,
            armor: 2,
            description: 'Armadura de placas sobrepostas, oferece boa proteção mas limita movimentos.'
        },
        {
            id: 'armadura-placas',
            name: 'Armadura de Placas',
            type: 'armor',
            tags: ['armadura 3', 'vestida', 'desengonçada'],
            price: 350,
            weight: 4,
            armor: 3,
            description: 'Proteção pesada de metal, a melhor defesa disponível.'
        },
        {
            id: 'escudo',
            name: 'Escudo',
            type: 'armor',
            tags: ['armadura +1'],
            price: 15,
            weight: 2,
            armor: 1,
            description: 'Escudo de madeira e metal, usado na mão secundária.'
        }
    ],

    /**
     * EQUIPAMENTOS GERAIS
     */
    equipment: [
        {
            id: 'equipamento-aventureiro',
            name: 'Equipamento de Aventureiro',
            type: 'equipment',
            tags: ['5 usos'],
            price: 20,
            weight: 1,
            maxUses: 5,
            description: 'Uma coleção de itens mundanos úteis como giz, bastões, espigões, cordas, etc. Quando mexer em seu equipamento de aventureiro em busca de algum item mundano útil, encontre o que precisa, e gaste um uso.'
        },
        {
            id: 'sacola-livros',
            name: 'Sacola de Livros',
            type: 'equipment',
            tags: ['5 usos'],
            price: 10,
            weight: 2,
            maxUses: 5,
            description: 'Quando sua sacola de livros contém aquele exato tomo a respeito do assunto sobre o qual você estiver falando difícil, consulte o livro, gaste um uso, e receba +1 em sua rolagem.'
        },
        {
            id: 'cachimbo-halfling',
            name: 'Cachimbo Halfling',
            type: 'equipment',
            tags: ['6 usos'],
            price: 5,
            weight: 0,
            maxUses: 6,
            description: 'Quando você compartilha um cachimbo halfling com alguém, gaste dois usos e receba +1 adiante para negociar com aquela pessoa.'
        },
        {
            id: 'barril-cerveja-ana',
            name: 'Barril de Cerveja Anã',
            type: 'equipment',
            tags: [],
            price: 10,
            weight: 4,
            description: 'Quando abrir um barril de cerveja anã e deixar que todos bebam livremente, receba +1 para suas rolagens de Farrear. Se beber o barril inteiro sozinho, você fica muito, mas muito bêbado mesmo.'
        }
    ],

    /**
     * CONSUMÍVEIS
     */
    consumables: [
        {
            id: 'bandagens',
            name: 'Bandagens',
            type: 'consumable',
            tags: ['3 usos', 'lento'],
            price: 5,
            weight: 0,
            maxUses: 3,
            description: 'Quando tiver alguns minutos para colocar bandagens nos ferimentos de alguém, cure 4 PV daquela pessoa e gaste um uso.'
        },
        {
            id: 'pomadas-ervas',
            name: 'Pomadas e Ervas',
            type: 'consumable',
            tags: ['2 usos', 'lento'],
            price: 10,
            weight: 1,
            maxUses: 2,
            description: 'Quando cuidadosamente tratar os ferimentos de uma pessoa com o uso de pomadas e ervas, cure 7 PV daquela pessoa e gaste um uso.'
        },
        {
            id: 'pocao-cura',
            name: 'Poção de Cura',
            type: 'consumable',
            tags: [],
            price: 50,
            weight: 0,
            description: 'Quando você beber uma poção de cura inteira, cure 10 PV ou remova uma debilidade, à sua escolha.'
        },
        {
            id: 'antitoxina',
            name: 'Antitoxina',
            type: 'consumable',
            tags: [],
            price: 10,
            weight: 0,
            description: 'Quando beber uma antitoxina, você será curado de um veneno que lhe estiver afligindo.'
        },
        {
            id: 'racoes-masmorra',
            name: 'Rações de Masmorra',
            type: 'consumable',
            tags: ['ração', '5 usos'],
            price: 3,
            weight: 1,
            maxUses: 5,
            description: 'Não tem um gosto muito bom, mas também não é de todo ruim.'
        },
        {
            id: 'banquete-pessoal',
            name: 'Banquete Pessoal',
            type: 'consumable',
            tags: ['ração', '1 uso'],
            price: 10,
            weight: 1,
            maxUses: 1,
            description: 'Pura ostentação, para dizer o mínimo.'
        },
        {
            id: 'bolacha-ana',
            name: 'Bolacha Anã',
            type: 'consumable',
            tags: ['requer anão', 'ração', '7 usos'],
            price: 3,
            weight: 1,
            maxUses: 7,
            description: 'Anões dizem que tem o sabor de sua terra natal. Todas as outras pessoas dizem que se tem sabor de terra natal, você veio de uma fazenda de suínos que estava pegando fogo.'
        },
        {
            id: 'pao-elfico',
            name: 'Pão Élfico',
            type: 'consumable',
            tags: ['ração', '7 usos'],
            price: 10,
            weight: 1,
            maxUses: 7,
            description: 'Apenas os maiores dos amigos dos elfos recebem esta rara delícia.'
        }
    ],

    /**
     * VENENOS
     */
    poisons: [
        {
            id: 'oleo-tagit',
            name: 'Óleo de Tagit',
            type: 'poison',
            tags: ['perigoso', 'aplicado'],
            price: 15,
            weight: 0,
            description: 'O alvo cai em um sono profundo.'
        },
        {
            id: 'erva-sangrenta',
            name: 'Erva Sangrenta',
            type: 'poison',
            tags: ['perigoso', 'toque'],
            price: 12,
            weight: 0,
            description: 'Até ser curado, sempre que o alvo rolar para causar dano, ele rola um d4 adicional e subtrai o resultado do dano provocado.'
        },
        {
            id: 'raiz-dourada',
            name: 'Raiz Dourada',
            type: 'poison',
            tags: ['perigoso', 'aplicado'],
            price: 20,
            weight: 0,
            description: 'O alvo trata a próxima criatura que ver como um aliado confiável, até que se prove o contrário.'
        },
        {
            id: 'lagrimas-serpente',
            name: 'Lágrimas da Serpente',
            type: 'poison',
            tags: ['perigoso', 'toque'],
            price: 10,
            weight: 0,
            description: 'Qualquer pessoa que role para causar dano no alvo deve rolar duas vezes o dado e utilizar o melhor resultado.'
        }
    ],

    /**
     * ITENS MÁGICOS
     */
    magicItems: [
        {
            id: 'argo-thaan',
            name: 'Argo-Thaan, Vingadora Sagrada',
            type: 'magicItem',
            tags: ['corpo a corpo'],
            price: null,
            weight: 2,
            damage: 'd12',
            description: 'Existem muitas espadas no mundo, mas apenas uma Argo-Thaan – uma lâmina feita de ouro, prata e luz, reverenciada como uma relíquia sagrada por todas as ordens e religiões que seguem o Bem. Seu toque é uma bênção e, para muitos, uma visão que traz lágrimas de felicidade.\n\nNas mãos de um paladino, ela atinge os inimigos sem erros e com força, aumentando seu dado de dano para d12, e concedendo a ele acesso a todos os movimentos da classe. Argo-Thaan também é capaz de causar ferimentos a qualquer criatura do Mal, independente de suas defesas. Nenhuma criatura maligna pode tocá-la sem sofrer uma dor agonizante. Nas mãos de alguém que não seja um paladino ela se torna uma simples espada, mais pesada e desajeitada que o normal – recebendo o rótulo desajeitada.\n\nArgo-Thaan, mesmo que não possua inteligência própria, será sempre atraída para a causa do Bem, como um pedaço de ferro é atraído por um imã.'
        },
        {
            id: 'flechas-acheron',
            name: 'Flechas de Acheron',
            type: 'magicItem',
            tags: ['munição 1'],
            price: null,
            weight: 1,
            maxUses: 1,
            description: 'Criadas nas trevas por um flecheiro cego, essas flechas conseguem encontrar seus alvos mesmo na mais profunda escuridão. Um arqueiro pode dispará-las cego, no escuro, com seus olhos vendados e ainda conseguir um tiro certeiro. Se a luz do sol tocar essas flechas, no entanto, elas se desfazem em sombras e pó.'
        },
        {
            id: 'machado-rei-conquistador',
            name: 'Machado do Rei Conquistador',
            type: 'magicItem',
            tags: ['corpo a corpo'],
            price: null,
            weight: 1,
            damage: 'd6',
            description: 'Forjado de aço polido, ele brilha com uma luz dourada e foi imbuído de poderes místicos de autoridade. Enquanto portar o machado, você se torna uma inspiração que guia todos aqueles que lidera. Quaisquer servos que empregar terão +1 de Lealdade, independente da qualidade de sua liderança.'
        },
        {
            id: 'espinho-portao-trevas',
            name: 'Espinho do Portão das Trevas',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Um prego ou espigão, torto e sempre gelado, que dizem ter sido removido dos Portões da Morte. Quando enfiado em um cadáver, ele desaparece e garante que aquele corpo jamais se erguerá novamente. Nenhuma magia que não venha da própria Morte será capaz de reacender sua chama da vida (natural ou não).'
        },
        {
            id: 'bolsa-espaco-infinito',
            name: 'Bolsa de Espaço Infinito',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Uma bolsa de espaço infinito é bem maior por dentro do que por fora, e pode conter uma quantidade ilimitada de itens sem que seu peso aumente. Quando tentar encontrar um item dentro da bolsa, role+SAB. Com 10+, ele está logo ali. Com 7-9, escolha um:\n• Você encontra o item exato, mas demora um tempo\n• Você encontra um item similar, à escolha do MJ, porém isso só lhe toma um momento\n\nIndependentemente da quantidade de itens nela contida, a bolsa de espaço infinito possui sempre peso 0.'
        },
        {
            id: 'roda-incandescente',
            name: 'A Roda Incandescente',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 2,
            description: 'Uma antiga roda de madeira, como as que aparecem em carroças de guerra, envolta em aço. Em uma rápida olhada, não é possível notar nada de especial - ela está com vários pedaços quebrados e parece totalmente mundana. Sob observação mágica ou pelos olhos de um especialista, sua verdadeira natureza é revelada: a Roda Incandescente é um presente do Deus do Fogo e queima com sua autoridade.\n\nQuando você segurar a Roda Incandescente e falar o nome de um deus, role+CON. Com 7+, o deus nomeado ouvirá seu chamado e lhe concederá uma audiência. Uma audiência com um deus nunca é gratuita: com 10+, escolha um de seus atributos e o reduza até o próximo modificador mais baixo (por exemplo, um 14 é +1, logo, ele seria reduzido para 12, que é +0). Com 7-9, o MJ escolhe qual atributo será reduzido.\n\nApós utilizada, a Roda Incandescente pega fogo e se queima em uma luz brilhante. Ela não oferece proteção contra essas chamas, e nem confere qualquer bônus para nadar.'
        },
        {
            id: 'cornucopia-capitao-bligh',
            name: 'Cornucópia do Capitão Bligh',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Uma trompa naval, curva e ornada, gravada com símbolos dos deuses da Fartura. Quando soprada, além do som, ela espirra comida suficiente para uma refeição capaz de alimentar todos os que ouvirem seu som.'
        },
        {
            id: 'espiral-carcosana',
            name: 'A Espiral Carcosana',
            type: 'magicItem',
            tags: ['alcance', 'arremesso'],
            price: null,
            weight: 3,
            damage: 'd6',
            description: 'Ninguém sabe de onde essa lança retorcida feita de coral branco se originou. Aqueles que a portam por muito tempo têm suas mentes preenchidas com sonhos alienígenas e começam a ouvir os estranhos pensamentos dos Outros. Ninguém é imune. Utilizada contra qualquer alvo "natural" (homens, goblins, ursos-coruja e similares), a Espiral age como uma lança mortal comum. Seu verdadeiro propósito é o de ferir criaturas cuja estranha natureza as proteja contra armas mundanas. Utilizada contra elas, a Espiral pode ferir inimigos que seriam de outra forma invulneráveis. O portador reconhecerá tais criaturas bizarras assim que as avistar – a lança reconhece os seus.'
        },
        {
            id: 'capa-estrelas-silenciosas',
            name: 'Capa de Estrelas Silenciosas',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Uma rica capa de veludo negro por fora e com um forro brilhante com pequenos pontos luminosos, essa capa dobra o destino, o tempo e a realidade ao seu redor para proteger o seu usuário, que se torna capaz de desafiar o perigo com qualquer atributo que quiser. Para fazê-lo, o usuário invoca a magia da capa e seu jogador descreve como ela o ajuda a "quebrar as regras". Ele pode defletir uma bola de fogo usando Carisma, convencendo-a de que não merece morrer ainda, ou evadir uma queda utilizando o poder da lógica de sua Inteligência, provando que ela não pode feri-lo. A capa torna essas coisas realidade. Ela pode ser usada uma vez para cada atributo antes de perder sua magia.'
        },
        {
            id: 'moeda-lembranca',
            name: 'Moeda da Lembrança',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'O que aparenta ser uma simples moeda de cobre é, na verdade, uma moeda encantada. Seu portador pode, a qualquer momento, gastá-la para aprender imediatamente um fato que tenha sido esquecido. A moeda desaparece em seguida. Não é necessário que seja algo que o próprio usuário tenha esquecido, mas não pode ser algo "conhecido". A interpretação disso é deixada para os deuses. Se a moeda não for bem sucedida, ela ainda imprime uma imagem mental no portador de alguém ou de alguma coisa que se lembra do que está sendo buscado.'
        },
        {
            id: 'pergaminho-comum',
            name: 'Pergaminho Comum',
            type: 'magicItem',
            tags: ['1 uso'],
            price: null,
            weight: 0,
            maxUses: 1,
            description: 'Um pergaminho comum possui uma magia nele inscrita, que pode ser conjurada por alguém que já seja capaz de conjurá-la, ou que a possua na lista de magias de sua classe. Quando a magia é conjurada com a utilização do pergaminho, ela surte efeito normalmente.'
        },
        {
            id: 'oleo-contra-demonios',
            name: 'Óleo Contra Demônios',
            type: 'magicItem',
            tags: ['1 uso'],
            price: null,
            weight: 0,
            maxUses: 1,
            description: 'Um óleo sagrado, de suprimento limitado, criado por uma facção de monges mudos da montanha, cuja ordem vem protegendo a humanidade dos poderes dos Poços Demoníacos desde o princípio dos tempos. Apenas algumas poucas jarras ainda existem. Quando aplicado a uma arma e esta for utilizada para atacar um habitante de outro plano, o óleo desfaz a magia que prende a criatura aqui. Em alguns casos, ele fará com que a criatura retorne ao seu plano original. Em outros, qualquer feitiço que a esteja controlando é simplesmente desfeito. O óleo permanece na arma por algumas horas antes de secar e se desfazer.\n\nSe aplicado nos cantos de uma porta ou utilizado para desenhar um círculo, o óleo repelirá criaturas cujo lar seja algum dos outros planos, tornando-as incapazes de atravessar o local. O óleo dura um dia inteiro dessa forma antes de ser absorvido ou evaporar.'
        },
        {
            id: 'cera-minhoca-ouvido',
            name: 'Cera de Minhoca de Ouvido',
            type: 'magicItem',
            tags: ['1 uso'],
            price: null,
            weight: 0,
            maxUses: 1,
            description: 'Uma vela amarelada, cuja chama parece nunca se acabar, emitindo uma luz estranha e fraca. Sua cera é sempre fria ao toque, também. Se pingar a cera na orelha de um alvo, ganhe domínio 3. Gaste o domínio para fazer uma pergunta ao alvo. Ele lhe responderá toda a verdade, independentemente de suas intenções. As consequências após o fato? Cabe a você lidar com elas.'
        },
        {
            id: 'o-eco',
            name: 'O Eco',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Uma garrafa aparentemente vazia. Assim que aberta, ela faz com que os sussurros de outros planos sejam ouvidos uma única vez e depois se silenciem. Durante o silêncio, o portador sente em sua própria alma a chegada de algum perigo e como ele pode evitar que aquilo ocorra. A qualquer momento após usar o Eco, ignore os efeitos de um único rolamento de dados – seu ou de outro jogador – e role novamente. Uma vez aberto, o Eco foi solto e terá se esvaído para sempre.'
        },
        {
            id: 'lentes-epoca',
            name: 'As Lentes de Época',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Um arquimago, velho e fraco demais para deixar sua torre, criou este intrincado e frágil dispositivo feito de vidro e ouro para examinar as histórias e relíquias que tanto amava. Observar um objeto através da lente revela visões a respeito de quem o criou e de onde ele veio.'
        },
        {
            id: 'pedra-visao-alem-alcance',
            name: 'Pedra da Visão Além do Alcance',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Nuvens rodopiantes preenchem esse orbe esfumaçado, e aqueles que permanecem em sua presença ouvem sussurros estranhos. Em tempos antigos, ele era parte de uma rede de pedras similares, utilizadas para comunicação e observação a longas distâncias. Quando fixar seu olhar na pedra, diga um lugar e role+SAB. Com 10+, você obtém uma visão clara daquele lugar, e a mantém enquanto se concentrar no orbe. Com 7-9, você ainda tem a visão, mas acaba chamando a atenção de outra coisa (um anjo, um demônio, ou o portador de outra Pedra da Visão Além do Alcance), que utilizará a pedra para lhe observar de volta.'
        },
        {
            id: 'codice-fiasco',
            name: 'Códice do Fiasco',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Um tomo grosso, que dizem ter sido escrito com o sangue de pobres tolos e de barões dos ladrões por algum príncipe demônio que possuía um senso de humor negro. O livro traz contos e histórias de pessoas cuja ambição sobrepujou sua razão. Ler este tomo ensina o valor de se manter a cabeça no lugar, mas deixa uma sensação ruim no leitor. Quando ler o Códice do Fiasco, role+SAB. Com 10+, faça duas das perguntas abaixo. Com 7-9, faça uma:\n• Qual é minha maior oportunidade neste momento?\n• Quem eu posso trair para obter as maiores vantagens?\n• Quem é um aliado em quem não posso confiar?\n\nO códice oferece respostas apenas uma vez para cada leitor, e demora de duas a três horas para ser lido.'
        },
        {
            id: 'frasco-folego',
            name: 'Frasco do Fôlego',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Uma coisa simples, mas útil quando você precisa de um sopro de ar fresco. O frasco parece vazio, mas não pode ser enchido de forma alguma – qualquer coisa adicionada a ele simplesmente espirra para fora. Isso ocorre porque o frasco está eternamente cheio de ar. Se colocado debaixo d\'água, produzirá bolhas para sempre. Se pressionado contra a boca, permite que a pessoa respire normalmente – sem se preocupar com fumaça, por exemplo. Tenho certeza de que vocês encontrarão diversos usos incomuns para isso.'
        },
        {
            id: 'asas-cera',
            name: 'Loucura nos Ares, as Asas de Cera, um Grande Erro',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Quem nunca quis voar pelo céu azul? Em uma tentativa de conceder tal desejo para as pessoas presas à terra, essas grandes asas mágicas foram criadas. Conhecidas por muitos nomes e produzidas pela mesma quantidade de magos, elas normalmente possuem a forma das asas dos pássaros mais comuns do local onde são construídas. São vestidas por meio de arreios ou, em alguns casos mais extremos, procedimentos cirúrgicos.\n\nQuando voar pelo ar com essas asas mágicas, role+DES. Com 10+, você voa de forma controlada e pode permanecer no ar por quanto tempo quiser. Com 7-9, você consegue voar, mas seu voo é curto ou errático e imprevisível, à sua escolha. Com 6-, você consegue voar, mas a descida e tudo o que acontece entre uma coisa e outra ficarão a cargo do MJ.'
        },
        {
            id: 'bastao-imovel',
            name: 'Bastão Imóvel',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Um bastão de metal engraçado com um botão. Aperte o botão e ele simplesmente fica ali, congelado no local onde estava – no meio do ar, de pé ou deitado. Ele não pode ser movido de forma alguma. Puxe-o ou empurre-o com o máximo de força que conseguir exercer, e ele ficará no lugar. Talvez ele possa ser destruído, talvez não. Aperte o botão novamente e ele estará livre – leve-o consigo. Pode ser útil ter algo tão teimoso assim em algum momento.'
        },
        {
            id: 'livro-infinito',
            name: 'Livro Infinito',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Este livro contém um número infinito de páginas em um espaço limitado. Sem limite de páginas, tudo o que existiu, existe e existirá está contido nele em algum lugar. Felizmente, o índice é muito bom.\n\nQuando falar difícil enquanto consulta o Livro Infinito você ganha uma cláusula extra: Com 12+, o MJ lhe dará a solução para o problema ou situação na qual você se encontra.'
        },
        {
            id: 'oculos-inspecao',
            name: 'Óculos de Inspeção',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Vidro mal feito em uma estrutura de madeira. Montados de qualquer jeito, eles mal se mantêm inteiros, mas de alguma forma estes óculos permitem ao usuário enxergar muito mais do que o olho nu permitiria. Quando discernir realidades utilizando estas lentes, você pode quebrar um pouco as regras. Com um 12+, pergunte quaisquer três questões que quiser. Elas não precisam estar na lista. Enquanto a visão puder lhe conceder respostas, o MJ lhe dirá o que você quiser saber.'
        },
        {
            id: 'movimento-kumeh',
            name: 'O Movimento de Ku\'Meh',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Um grande tomo com capa de couro, gasto pelas mãos de grandes generais, este livro foi normalmente passado de guerreiro para guerreiro, de pai para filho ao longo das grandes linhas de batalha que dividiram Dungeon World em seu passado. Qualquer pessoa que o ler poderá, assim que chegar ao seu final pela primeira vez, rolar+INT. Com 10+, domínio 3. Com 7-9, domínio 1. Você pode gastar seu domínio para aconselhar um companheiro em algum assunto relacionado a estratégia ou tática. Este conselho lhe permite, a qualquer momento, independente da distância, rolar para ajudá-lo em um movimento qualquer. Com uma falha, o MJ ganha domínio 1 e pode gastá-lo para aplicar uma penalidade de -2 em um de seus rolamentos ou dos rolamentos do pobre coitado que resolveu te escutar.'
        },
        {
            id: 'memento-lastimado',
            name: 'Memento Lastimado',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Tomando a forma de um cacho de cabelos vermelhos brilhantes, amarrado em um laço preto e imune à depredação do tempo, o Memento Lastimado traz um encantamento sombrio. Nele estão as memórias e emoções de uma garota que lidou com a Morte em seus Portões Negros tantas vezes que, no fim, eles se apaixonaram e ela abandonou este mundo. A memória dela protege o portador. Se este se encontrar diante dos Portões, o Memento pode ser trocado por um resultado automático de 10+ no movimento último suspiro.'
        },
        {
            id: 'escudo-ima',
            name: 'Escudo Ímã',
            type: 'magicItem',
            tags: ['+1 armadura'],
            price: null,
            weight: 1,
            armor: 1,
            description: 'Que idiota teria feito isso? Escudos servem para repelir o metal, e não atraí-lo! Enfeitado com um feroz leão, o Escudo Ímã tem o poder de atrair lâminas e flechas para si. Quando defender contra inimigos que estejam usando armas metálicas, você pode gastar 1 de domínio, por alvo, para desarmá-lo. Além disso, de vez em quando, é possível encontrar algumas moedas grudadas nele.'
        },
        {
            id: 'mapa-ultima-patrulha',
            name: 'Mapa da Última Patrulha',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Uma antiga ordem de corajosos rangers já patrulhou a terra, protegendo vilas e avisando reis e rainhas de perigos que se aproximavam. Eles se foram há muito tempo, mas seu legado continua. Este mapa, quando marcado com o sangue de um grupo de pessoas, irá sempre mostrar sua localização – enquanto eles permanecerem nos limites do que está desenhado no mapa.'
        },
        {
            id: 'cabeca-ned',
            name: 'Cabeça de Ned',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Um velho crânio, que não tem mais a mandíbula, e está horrivelmente gasto. O crânio se lembra da tolice de seu antigo dono – um homem com mais honra do que bom senso. Uma vez por noite, o dono deste objeto pode perguntar "quem está atrás de mim?" e o crânio lhe dará um nome em uma voz triste e solitária. Se o dono atual for morto, este item desaparece sem rastros. Ninguém sabe onde ele poderá aparecer novamente.'
        },
        {
            id: 'chave-noturnos',
            name: 'Chave dos Noturnos',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Esta chave é capaz de destrancar qualquer porta, considerando que o usuário não seja permitido no local onde planeja ir. Enquanto não fizer nada que vá alertar outras pessoas de sua presença (permanecer em silêncio e escondido) e não levar nada mais do que suas memórias com você, a magia da chave irá impedir que sua invasão seja descoberta. Será como se você nunca tivesse ido lá.'
        },
        {
            id: 'ervas-sagradas',
            name: 'Ervas Sagradas',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Ervas sagradas, colhidas e preparadas por uma ordem perdida de monges feiticeiros, podem ser encontradas em feixes com uns dois ou três usos ainda. Mantidas secas, elas duram indefinidamente. Quando fumadas em um cachimbo ou consumidas em um incensário e sua fumaça grossa e azulada for inalada, essas ervas lhe concederão estranhas visões de lugares longínquos e tempos distantes. Se focar sua vontade em uma pessoa, lugar ou coisa específica, as ervas responderão; role+SAB. Com 10+, a visão é clara e útil – trazendo alguma informação válida. Com 7-9, a visão é a respeito do objeto desejado, porém não é clara, cheia de metáforas e difícil de compreender de alguma maneira. Com uma falha, o MJ lhe perguntará "o que você mais teme?". Sua resposta deve ser honesta, obviamente.'
        },
        {
            id: 'pato-sartar',
            name: 'O Pato de Sartar',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Um estranho pato de madeira, feito à mão. Quem faria algo tão estranho? Enquanto o carregar consigo, você se tornará um excelente contador de histórias – independentemente do idioma, você e sua história serão claros para qualquer audiência. Eles entenderão o que você quis dizer, e não suas exatas palavras.'
        },
        {
            id: 'lagrimas-annalise',
            name: 'Lágrimas de Annalise',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Gemas vermelhas e enevoadas do tamanho de um dedal, as Lágrimas de Annalise são sempre encontradas em par. Quando engolidas por duas pessoas diferentes, elas unem essas pessoas – quando algum dos dois sentir uma emoção muito forte (particularmente tristeza, perda, medo ou desejo) o outro também a sentirá. Os efeitos duram até que um dos dois derrame o sangue do outro.'
        },
        {
            id: 'sala-teleporte',
            name: 'Sala do Teleporte',
            type: 'magicItem',
            tags: ['lento'],
            price: null,
            weight: 0,
            description: 'James Novededos, um mago genial e bem excêntrico, criou esses aparatos mágicos do tamanho de uma sala. Uma câmara de pedra cheia de runas e escrituras com um brilho azul pálido. Quando entrar na sala e disser o nome de um lugar, role+INT. Com 10+, você chega exatamente onde queria ir. Com 7-9, o MJ escolhe um local seguro próximo. Com uma falha, você vai para algum lugar. Talvez seja próximo? Certamente não é seguro. Coisas estranhas acontecem com aqueles que tentam dobrar o tempo e o espaço com tais dispositivos.'
        },
        {
            id: 'armadura-timunn',
            name: 'Armadura de Timunn',
            type: 'magicItem',
            tags: ['armadura 1'],
            price: null,
            weight: 0,
            armor: 1,
            description: 'Uma armadura furtiva, ela se parece com muitas coisas diferentes para pessoas diferentes, e se camufla como roupas apropriadas. O usuário sempre parecerá estar na última moda para qualquer pessoa que o observar.'
        },
        {
            id: 'sebo-verdadeiro-titus',
            name: 'Sebo Verdadeiro de Titus',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 0,
            description: 'Uma vela feita de um sebo de coloração marfim e cobre com um fio de prata como pavio. Quando acesa, nenhuma pessoa que for iluminada por sua luz será capaz de dizer uma mentira. Eles podem ficar em silêncio ou ir embora, mas quando questionados diretamente, eles não podem falar nada além da verdade.'
        },
        {
            id: 'corda-cheia-truques',
            name: 'Corda Cheia de Truques',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Uma corda que ouve seu dono. E faz truques também, como uma cobra esperta e bem obediente seria capaz de fazer. Diga a ela para se "enrolar", "ficar no lugar" ou "venha aqui, corda", e ela o fará.'
        },
        {
            id: 'mao-esterlina',
            name: 'A Mão Esterlina',
            type: 'magicItem',
            tags: ['próximo'],
            price: null,
            weight: 0,
            damage: 'd6',
            description: 'Forjada por anões ferreiros, esta mão de metal espelhado é profundamente marcada com runas de poder e rejuvenescimento. Criada para substituir membros feridos ou destruídos durante acidentes ocorridos em minas, a Mão Esterlina se une ao ferimento, velho ou novo, e é forte e resistente. Ela pode ser usada como uma arma (distância próximo) e é feita de prata pura o suficiente para ser capaz de ferir criaturas por ela afetadas.'
        },
        {
            id: 'manoplas-vellius',
            name: 'Manoplas de Vellius',
            type: 'magicItem',
            tags: [],
            price: null,
            weight: 1,
            description: 'Forjadas em nome de Vellius, o Sem Jeito, Vellius Dedos Amanteigados, Vellius, o Desastrado, essas luvas de pano simples impedem que você deixe cair qualquer objeto contra a sua vontade. Você não poderá ser desarmado e não cairá de qualquer corda ou escada, por exemplo. O uso deste item pode dar muito errado quando alguma coisa lhe puxa muito forte pelas pernas enquanto você estiver se segurando em algum lugar.'
        },
        {
            id: 'gladio-violacao',
            name: 'Gládio da Violação',
            type: 'magicItem',
            tags: ['alcance'],
            price: null,
            weight: 2,
            damage: 'd6',
            description: 'Uma espada lendária, cujos rumores indicam que foi enviada para o passado a partir de um futuro sombrio, o gládio da violação foi feito de um estranho metal esverdeado. A lâmina ataca a mente daqueles que fere, assim como ataca seu corpo. Quando matar ou pilhar, com 10+, você recebe uma opção a mais: cause seu dano normal, deixe os inimigos contra-atacarem, e encha-os com uma emoção de sua escolha (talvez medo, reverência ou confiança).'
        },
        {
            id: 'espada-vorpal',
            name: 'Espada Vorpal',
            type: 'magicItem',
            tags: ['corpo a corpo', '3 penetrante'],
            price: null,
            weight: 2,
            damage: 'd6',
            piercing: 3,
            description: 'Tcham e tchum e tudo o mais. Afiada como quase nada consegue ser, esta espada aparentemente simples foi criada para separar as coisas umas das outras – um membro do corpo, ou uma pessoa de sua vida. Quando causar dano com a Espada Vorpal, seu inimigo deve escolher alguma coisa (um item, uma vantagem, um membro) e perder essa coisa permanentemente.'
        }
    ],

    /**
     * Retorna todos os itens de uma categoria
     */
    getByCategory(category) {
        return this[category] || [];
    },

    /**
     * Retorna um item pelo ID
     */
    getById(id) {
        const allItems = [
            ...this.weapons,
            ...this.armor,
            ...this.equipment,
            ...this.consumables,
            ...this.poisons,
            ...this.magicItems
        ];
        return allItems.find(item => item.id === id);
    },

    /**
     * Retorna todos os itens
     */
    getAll() {
        return [
            ...this.weapons,
            ...this.armor,
            ...this.equipment,
            ...this.consumables,
            ...this.poisons,
            ...this.magicItems
        ];
    },

    /**
     * Busca itens por nome ou tag
     */
    search(query) {
        const q = query.toLowerCase();
        return this.getAll().filter(item => 
            item.name.toLowerCase().includes(q) ||
            item.tags.some(tag => tag.toLowerCase().includes(q))
        );
    }
};

// Exporta globalmente
window.EquipmentLibrary = EquipmentLibrary;
