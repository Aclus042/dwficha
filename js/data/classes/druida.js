/**
 * =====================================================
 * DUNGEON WORLD - DRUIDA
 * Conteúdo oficial do livro Dungeon World
 * =====================================================
 * 
 * ⚠️ TODO O TEXTO É LITERAL DO LIVRO - NÃO MODIFICAR
 */

const CLASS_DRUIDA = {
    id: "druida",
    name: "Druida",
    namePlural: "Druidas",
    description: "Um guardião da natureza capaz de assumir formas animais e comandar os elementos.",
    
    // CARACTERÍSTICAS
    baseHP: 6,
    baseDamage: "d6",
    baseLoad: 6, // 6+FOR
    
    // RAÇAS
    races: [
        {
            id: "elfo",
            name: "Elfo",
            description: "A seiva das árvores antigas corre em seu corpo. Além de quaisquer outras ligações, a Grande Floresta é sempre considerada sua terra.",
            bonusLand: "grande_floresta"
        },
        {
            id: "humano",
            name: "Humano",
            description: "Assim como seu povo aprendeu a vincular os animais ao campo e à fazenda, você também se encontra vinculado a eles. Você sempre será capaz de assumir a forma de qualquer animal domesticado, além de suas opções normais.",
            bonusForms: "domesticated"
        },
        {
            id: "halfling",
            name: "Halfling",
            description: "Você canta as canções restauradoras da primavera e do riacho. Sempre que montar acampamento, você e seus aliados curam +1d6.",
            campBonus: "+1d6 cura"
        }
    ],
    
    // ALINHAMENTO
    alignments: [
        {
            id: "caotico",
            name: "Caótico",
            description: "Destruir um símbolo de civilização."
        },
        {
            id: "bom",
            name: "Bom",
            description: "Ajudar alguma coisa ou alguém a crescer."
        },
        {
            id: "neutro",
            name: "Neutro",
            description: "Eliminar uma ameaça não natural."
        }
    ],
    
    // TERRAS - característica única do Druida
    lands: {
        description: "Escolha uma das opções a seguir – ela representa a terra a qual você se encontra ligado. Sempre que se metamorfosear, você será capaz de assumir a forma de qualquer animal que vive em sua terra.",
        options: [
            { id: "grande_floresta", name: "A Grande Floresta" },
            { id: "planicies_sussurrantes", name: "As Planícies Sussurrantes" },
            { id: "vasto_deserto", name: "O Vasto Deserto" },
            { id: "lamacal_fedorento", name: "O Lamaçal Fedorento" },
            { id: "delta_rio", name: "O Delta do Rio" },
            { id: "profundezas_terra", name: "As Profundezas da Terra" },
            { id: "ilhas_safira", name: "As Ilhas de Safira" },
            { id: "mar_aberto", name: "O Mar Aberto" },
            { id: "montanhas_elevadas", name: "As Montanhas Elevadas" },
            { id: "norte_gelado", name: "O Norte Gelado" },
            { id: "terra_devastada", name: "A Terra Devastada" }
        ]
    },
    
    // VÍNCULOS
    suggestedBonds: [
        "________________ tem cheiro de caça, e não de caçador.",
        "Os espíritos me alertaram acerca de um grande perigo que ronda ________________.",
        "Eu mostrei a ________________ um ritual secreto da Terra.",
        "________________ provou meu sangue, e eu o seu. Estamos unidos por isso."
    ],
    
    // EQUIPAMENTO
    startingEquipment: {
        fixed: [
            { name: "Você carrega alguma lembrança de sua terra", weight: 0, tags: [], customizable: true, customizePrompt: "Descreva-a" }
        ],
        choices: [
            {
                id: "defesa",
                title: "Escolha suas defesas:",
                multiSelect: true,
                options: [
                    {
                        id: "armadura_peles",
                        items: [
                            { name: "Armadura de peles", weight: 1, armor: 1, tags: ["armadura 1", "peso 1"] }
                        ]
                    },
                    {
                        id: "escudo_madeira",
                        items: [
                            { name: "Escudo de madeira", weight: 1, armor: 1, tags: ["armadura +1", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "armamento",
                title: "Escolha seu armamento:",
                options: [
                    {
                        id: "shillelagh",
                        items: [
                            { name: "Shillelagh", weight: 2, tags: ["corpo a corpo", "peso 2"] }
                        ]
                    },
                    {
                        id: "cajado",
                        items: [
                            { name: "Cajado", weight: 1, tags: ["corpo a corpo", "duas mãos", "peso 1"] }
                        ]
                    },
                    {
                        id: "lanca",
                        items: [
                            { name: "Lança", weight: 1, tags: ["corpo a corpo", "arremesso", "próxima", "peso 1"] }
                        ]
                    }
                ]
            },
            {
                id: "suprimentos",
                title: "Escolha um:",
                options: [
                    {
                        id: "equipamento_aventureiro",
                        items: [
                            { name: "Equipamento de aventureiro", weight: 1, tags: ["peso 1"] }
                        ]
                    },
                    {
                        id: "cataplasmas_ervas",
                        items: [
                            { name: "Cataplasmas e ervas", weight: 1, tags: ["2 usos", "peso 1"] }
                        ]
                    },
                    {
                        id: "cachimbo_halfling",
                        items: [
                            { name: "Cachimbo halfling", weight: 0, tags: ["peso 0"] }
                        ]
                    },
                    {
                        id: "antitoxinas",
                        items: [
                            { name: "3 antitoxinas", weight: 0, tags: ["peso 0"] }
                        ]
                    }
                ]
            }
        ]
    },
    
    // MOVIMENTOS INICIAIS
    startingMoves: [
        {
            id: "nutrido_natureza",
            name: "Nutrido pela Natureza",
            description: "Você não precisa comer ou beber nada. Se um movimento exigir que você marque uma ração, simplesmente ignore isso.",
            required: true
        },
        {
            id: "linguagem_espiritos",
            name: "Linguagem dos Espíritos",
            description: "Os grunhidos, latidos, guinchos e chamados das criaturas selvagens são uma forma de linguagem para você. Você é capaz de compreender qualquer animal nativo da sua terra ou que seja similar a algum cuja essência tenha estudado.",
            required: true            
        },
        {
            id: "nascido_solo",
            name: "Nascido do Solo",
            description: "Você aprendeu sua magia em um local cujos espíritos são poderosos e antigos, e eles o marcaram como um deles. Independente de onde vá, eles vivem dentro de você, e o permitirão assumir suas formas. Escolha uma das opções a seguir – ela representa a terra a qual você se encontra ligado. Sempre que se metamorfosear, você será capaz de assumir a forma de qualquer animal que vive em sua terra.",
            landOptions: [
                "A Grande Floresta",
                "As Planícies Sussurrantes",
                "O Vasto Deserto",
                "O Lamaçal Fedorento",
                "O Delta do Rio",
                "As Profundezas da Terra",
                "As Ilhas de Safira",
                "O Mar Aberto",
                "As Montanhas Elevadas",
                "O Norte Gelado",
                "A Terra Devastada"
            ],
            requiresMark: true,
            markDescription: "Escolha uma marca – um atributo físico que o identifica como um nascido do solo. Pode ser uma característica animal como antenas, ou as manchas de um leopardo, ou algo mais genérico, como cabelos que se parecem com folhas, ou olhos de cristal brilhante. Sua marca permanece independente da forma que assumir.",
            markPlaceholder: "Ex: Olhos de coruja, manchas de leopardo, cabelo como folhas...",
            required: true            
        },
        {
            id: "metamorfose",
            name: "Metamorfose",
            trigger: "Quando chamar os espíritos para mudar sua forma",
            description: "Quando chamar os espíritos para mudar sua forma, role+SAB. Você consegue assumir a forma de qualquer espécie cuja essência tenha estudado ou que viva em sua terra, fundindo sua própria forma e seus pertences em uma cópia perfeita da espécie desejada. Com isso, você adquire quaisquer habilidades e fraquezas inatas do animal: garras, asas, guelras, respirar na água e não no ar. Continue usando suas próprias características, mas alguns movimentos podem se tornar mais complicados de serem iniciados – um gato doméstico terá dificuldades em combater um ogro. O MJ também lhe informará a respeito de um ou mais movimentos associados à sua nova forma. Gaste 1 domínio para realizar aquele movimento. Assim que seu domínio se esgotar, você retorna à sua forma natural. É possível fazer isso também gastando todo o seu domínio.",
            attribute: "sab",
            results: {
                success: "Domínio 3.",
                partial: "Domínio 2.",
                fail: "Domínio 1 além de qualquer outra coisa definida pelo MJ."
            },
            hasHoldSystem: true,
            holdName: "domínio",
            required: true
        },
        {
            id: "essencia_estudada",
            name: "Essência Estudada",
            trigger: "Quando passar algum tempo contemplando um espírito animal",
            description: "Quando passar algum tempo contemplando um espírito animal, você pode adicioná-lo às espécies cuja forma é capaz de assumir através de metamorfose.",
            required: true
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 2–5
    advancedMoves2_5: [
        {
            id: "irmao_cacador",
            name: "Irmão do Caçador",
            description: "Escolha um movimento da lista de classe do ranger.",
            allowsMulticlass: true,
            multiclassSource: "ranger"
        },
        {
            id: "pele_madeira",
            name: "Pele de Madeira",
            trigger: "Enquanto seus pés estiverem tocando o solo",
            description: "Enquanto seus pés estiverem tocando o solo, receba +1 de armadura."
        },
        {
            id: "garras_dentes_vermelhos",
            name: "Garras e Dentes Vermelhos",
            trigger: "Quando estiver em uma forma animal apropriada (alguma bem perigosa)",
            description: "Quando estiver em uma forma animal apropriada (alguma bem perigosa), aumente seu dano para d8."
        },
        {
            id: "trocar_pele",
            name: "Trocar a Pele",
            trigger: "Quando receber danos enquanto estiver metamorfoseado",
            description: "Quando receber danos enquanto estiver metamorfoseado, você pode optar por retornar à sua forma natural para negar todo o dano."
        },
        {
            id: "maestria_elemental",
            name: "Maestria Elemental",
            trigger: "Quando invocar os espíritos primordiais do fogo, água, terra, ou ar para realizar uma tarefa em seu nome",
            description: "Quando invocar os espíritos primordiais do fogo, água, terra, ou ar para realizar uma tarefa em seu nome, role+SAB.",
            attribute: "sab",
            results: {
                success: "Escolha 2.",
                partial: "Escolha 1.",
                fail: "Seu chamado resulta em alguma catástrofe."
            },
            options: [
                "O efeito desejado ocorre",
                "Você evita pagar o preço cobrado pela natureza",
                "Você permanece no controle da situação"
            ]
        },
        {
            id: "comunhao_sussurros",
            name: "Comunhão dos Sussurros",
            trigger: "Quando passar algum tempo em um local, observando seus espíritos residentes e convocando os espíritos de sua terra",
            description: "Quando passar algum tempo em um local, observando seus espíritos residentes e convocando os espíritos de sua terra, role+SAB. Você receberá uma visão importante a respeito de si próprio, de seus aliados, e dos espíritos ao seu redor.",
            attribute: "sab",
            results: {
                success: "A visão será clara e útil.",
                partial: "A visão é pouco clara, e seu significado nebuloso.",
                fail: "A visão é incômoda, aterrorizante ou traumatizante. O MJ irá descrevê-la. Receba -1 adiante."
            }
        },
        {
            id: "olhos_tigre",
            name: "Olhos do Tigre",
            trigger: "Quando marcar um animal (com lama, poeira ou sangue)",
            description: "Quando marcar um animal (com lama, poeira ou sangue) você poderá enxergar através dos olhos dele como se fossem os seus, independente da distância que os separar. Apenas um animal pode ser marcado dessa forma por vez."
        },
        {
            id: "criador_formas",
            name: "Criador de Formas",
            trigger: "Quando se metamorfosear",
            description: "Quando se metamorfosear, escolha uma habilidade: você recebe +1 constante em rolamentos que a utilizem enquanto mantiver a outra forma. O MJ também vai escolher uma habilidade, e você receberá -1 constante nela enquanto permanecer metamorfoseado."
        },
        {
            id: "equilibrio",
            name: "Equilíbrio",
            trigger: "Quando causar dano",
            description: "Quando causar dano, receba equilíbrio 1. Quando tocar alguém e canalizar os espíritos da vida, você poderá gastar equilíbrio. Para cada equilíbrio gasto, cure 1d4 PV.",
            hasHoldSystem: true,
            holdName: "equilíbrio"            
        },
        {
            id: "falar_coisas",
            name: "Falar com Coisas",
            description: "Você enxerga os espíritos da areia, do mar e da pedra, e pode agora aplicar sua linguagem dos espíritos, metamorfose e estudar essência em objetos inanimados naturais (plantas e rochas) ou criaturas criadas, assim como faz com os animais. As formas adotadas por aqueles que podem falar com coisas podem ser cópias exatas ou vagamente humanoides e móveis."
        }
    ],
    
    // MOVIMENTOS AVANÇADOS - NÍVEIS 6–10
    advancedMoves6_10: [
        {
            id: "irma_espreitador",
            name: "Irmã do Espreitador",
            description: "Escolha um movimento da lista de classe do ranger.",
            allowsMulticlass: true,
            multiclassSource: "ranger"
        },
        {
            id: "adotar_forma_alguma",
            name: "Adotar Forma Alguma",
            trigger: "Quando se metamorfosear",
            description: "Quando se metamorfosear, role 1d4 e some o resultado ao seu domínio."
        },
        {
            id: "sangue_trovao",
            name: "Sangue e Trovão",
            replaces: "Garras e Dentes Vermelhos",
            trigger: "Quando estiver em uma forma animal apropriada (alguma bem perigosa)",
            description: "Quando estiver em uma forma animal apropriada (alguma bem perigosa), aumente seu dano para d10."
        },
        {
            id: "moldador_formas",
            name: "Moldador de Formas",
            requires: "Criador de Formas",
            description: "Você pode aumentar sua armadura em 1 ou causar +1d4 de dano quando estiver em uma forma animal. Escolha um dos dois quando se metamorfosear."
        },
        {
            id: "tecer_clima",
            name: "Tecer o Clima",
            trigger: "Quando se encontrar sob o céu aberto enquanto o sol estiver nascendo",
            description: "Quando se encontrar sob o céu aberto enquanto o sol estiver nascendo, o MJ lhe perguntará como será o clima ao longo daquele dia. Diga o que quiser, e isso irá acontecer."
        },
        {
            id: "falar_mundo",
            name: "Falar com o Mundo",
            requires: "Falar com Coisas",
            description: "Você consegue enxergar os padrões que formam o tecido do mundo, e torna-se capaz de aplicar sua linguagem dos espíritos, metamorfose e estudar essência aos elementos puros – fogo, água, ar e terra."
        },
        {
            id: "danca_doppelganger",
            name: "Dança do Doppelgänger",
            description: "Você se torna capaz de estudar a essência de indivíduos específicos e assumir suas formas exatas, incluindo homens, elfos e similares. É possível suprimir sua marca, mas se o fizer, receba -1 constante até retornar à sua própria forma."
        },
        {
            id: "quimera",
            name: "Quimera",
            trigger: "Quando se metamorfosear",
            description: "Quando se metamorfosear, você pode criar uma forma mista que reúne até três formas diferentes. É possível tornar-se um urso com asas de águia e a cabeça de um bode, por exemplo. Cada característica lhe concederá um movimento diferente. Sua forma quimérica segue normalmente as outras regras de metamorfose."
        },
        {
            id: "sono_druida",
            name: "O Sono do Druida",
            description: "Quando escolher este movimento, na próxima oportunidade em que estiver à salvo e puder passar algum tempo em um local apropriado, você pode se ligar a uma nova terra. Este efeito acontece apenas uma vez e o MJ lhe dirá quanto tempo vai levar e qual o preço que você deverá pagar. Daquele momento em diante, você será considerado nascido do solo de ambas as terras."
        }
    ]
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASS_DRUIDA = CLASS_DRUIDA;
}

