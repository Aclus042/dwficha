/**
 * =====================================================
 * DUNGEON WORLD - ESTADO GLOBAL
 * Gerenciamento centralizado do estado da aplicação
 * =====================================================
 */

const Store = {
    // Estado inicial
    state: {
        // Navegação
        currentPage: 'class-selection', // 'class-selection' | 'character-sheet'
        currentSection: 'personagem', // 'personagem' | 'dados' | 'inventario' | 'movimentos'
        
        // Personagem atual
        character: null,
        
        // Estado de UI
        isLoading: false,
        isSaving: false,
        hasUnsavedChanges: false
    },

    // Listeners para mudanças de estado
    listeners: [],

    /**
     * Obtém o estado atual ou uma propriedade específica
     * @param {string} key - Chave opcional
     * @returns {any} - Estado ou valor da propriedade
     */
    get(key) {
        if (key) {
            return this.state[key];
        }
        return this.state;
    },

    /**
     * Atualiza o estado
     * @param {Object} updates - Objeto com atualizações
     */
    set(updates) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...updates };
        this.notify(oldState, this.state);
    },

    /**
     * Atualiza uma propriedade aninhada do personagem
     * @param {string} path - Caminho da propriedade (ex: 'attributes.for')
     * @param {any} value - Novo valor
     */
    setCharacterProperty(path, value) {
        if (!this.state.character) return;
        
        const oldState = { ...this.state };
        
        const keys = path.split('.');
        let obj = this.state.character;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]]) {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
        this.state.hasUnsavedChanges = true;
        this.notify(oldState, this.state);
    },

    /**
     * Registra um listener para mudanças de estado
     * @param {Function} callback - Função a ser chamada
     * @returns {Function} - Função para cancelar o registro
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    },

    /**
     * Notifica todos os listeners sobre mudança de estado
     * @param {Object} oldState - Estado anterior
     * @param {Object} newState - Novo estado
     */
    notify(oldState, newState) {
        this.listeners.forEach(callback => {
            try {
                callback(newState, oldState);
            } catch (e) {
                console.error('Erro em listener:', e);
            }
        });
    },

    /**
     * Cria um novo personagem com a classe selecionada
     * @param {string} classId - ID da classe
     * @returns {Object} - Novo personagem
     */
    createCharacter(classId) {
        const classData = getClassById(classId);
        if (!classData) return null;

        // Moedas iniciais podem vir da classe ou ser 0
        const startingCoins = classData.startingEquipment?.startingCoins || 0;

        const character = {
            id: Helpers.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            
            // Dados básicos
            name: '',
            classId: classId,
            className: classData.name,
            race: null,
            alignment: null,
            level: 1,
            xp: 0,
            
            // Vínculos Sugeridos (formato: { index: { enabled: bool, names: { 0: 'nome', 1: 'nome' } } })
            suggestedBonds: {},
            
            // Vínculos Customizados (formato: [{ id, text, resolved }])
            customBonds: [],
            
            // Anotações do Personagem
            appearance: '',
            history: '',
            goal: '',
            notes: '',
            
            // Atributos
            attributes: {
                for: 10,
                des: 10,
                con: 10,
                int: 10,
                sab: 10,
                car: 10
            },
            
            // Combate
            currentHP: classData.baseHP + 10, // Assumindo CON 10
            armor: 0,
            
            // Inventário
            coins: startingCoins,
            inventory: [],
            equipmentChoices: {},
            
            // Movimentos
            acquiredMoves: [],
            
            // Dados específicos de classe
            classSpecific: {}
        };

        this.set({
            character: character,
            hasUnsavedChanges: true
        });

        return character;
    },

    /**
     * Carrega um personagem de um objeto
     * @param {Object} characterData - Dados do personagem
     * @returns {Object|null} - Personagem ou null
     */
    loadCharacter(characterData) {
        if (characterData && characterData.classId) {
            this.set({
                character: characterData,
                hasUnsavedChanges: false
            });
            return characterData;
        }
        return null;
    },

    /**
     * Exporta o personagem atual para arquivo
     * @returns {boolean} - Sucesso
     */
    exportCharacter() {
        if (!this.state.character) return false;
        
        this.state.character.updatedAt = new Date().toISOString();
        return Helpers.exportCharacter(this.state.character);
    },

    /**
     * Importa personagem de arquivo
     * @returns {Promise<Object>} - Personagem importado
     */
    async importCharacter() {
        const character = await Helpers.importCharacter();
        if (character) {
            this.loadCharacter(character);
        }
        return character;
    },

    /**
     * Navega para uma página
     * @param {string} page - Nome da página
     */
    navigateTo(page) {
        this.set({ currentPage: page });
    },

    /**
     * Muda a seção atual da ficha
     * @param {string} section - Nome da seção
     */
    setSection(section) {
        this.set({ currentSection: section });
    },

    /**
     * Reseta o estado para o inicial
     */
    reset() {
        this.set({
            currentPage: 'class-selection',
            currentSection: 'personagem',
            character: null,
            hasUnsavedChanges: false
        });
    },

    /**
     * Calcula valores derivados do personagem
     * @returns {Object} - Valores calculados
     */
    getCalculatedValues() {
        if (!this.state.character) return null;

        const char = this.state.character;
        const classData = getClassById(char.classId);
        
        if (!classData) return null;

        const mods = {
            for: Helpers.calculateModifier(char.attributes.for),
            des: Helpers.calculateModifier(char.attributes.des),
            con: Helpers.calculateModifier(char.attributes.con),
            int: Helpers.calculateModifier(char.attributes.int),
            sab: Helpers.calculateModifier(char.attributes.sab),
            car: Helpers.calculateModifier(char.attributes.car)
        };

        const maxLoad = Helpers.calculateMaxLoad(classData.baseLoad, mods.for);
        const currentLoad = Helpers.calculateTotalWeight(char.inventory);
        
        // Calcular armadura base dos itens
        let totalArmor = Helpers.calculateTotalArmor(char.inventory) + (char.armor || 0);
        
        // Bônus de "Desimpedido e Ileso" do Bárbaro
        const unencumberedBonus = this.calculateUnencumberedBonus(char, maxLoad, currentLoad);
        totalArmor += unencumberedBonus;
        
        // Bônus de movimentos que concedem armadura (ex: Muito Oprimido do Ladrão)
        const movementArmorBonus = this.calculateMovementArmorBonus(char, classData);
        totalArmor += movementArmorBonus;

        return {
            modifiers: mods,
            maxHP: Helpers.calculateMaxHP(classData.baseHP, char.attributes.con),
            maxLoad: maxLoad,
            currentLoad: currentLoad,
            totalArmor: totalArmor,
            unencumberedBonus: unencumberedBonus,
            movementArmorBonus: movementArmorBonus,
            xpToLevel: Helpers.calculateXPToLevel(char.level),
            damage: classData.baseDamage
        };
    },

    /**
     * Calcula o bônus de armadura de "Desimpedido e Ileso" do Bárbaro
     * @param {Object} char - Dados do personagem
     * @param {number} maxLoad - Carga máxima
     * @param {number} currentLoad - Carga atual
     * @returns {number} - Bônus de armadura (0 ou 1)
     */
    calculateUnencumberedBonus(char, maxLoad, currentLoad) {
        // Verifica se é bárbaro e escolheu "Desimpedido e Ileso"
        if (char.classId !== 'barbaro') return 0;
        if (char.classSpecific?.combatStyle !== 'Desimpedido e Ileso') return 0;
        
        // Verifica se está abaixo da carga máxima
        if (currentLoad >= maxLoad) return 0;
        
        // Verifica se tem qualquer item equipado que dá armadura (armadura ou escudo)
        const inventory = char.inventory || [];
        const hasEquippedProtection = inventory.some(item => {
            // Item precisa estar equipado E ter valor de armadura > 0
            return item.equipped && item.armor && item.armor > 0;
        });
        
        if (hasEquippedProtection) return 0;
        
        // Todas as condições atendidas: +1 armadura
        return 1;
    },
    
    /**
     * Calcula o bônus de armadura concedido por movimentos adquiridos
     * @param {Object} char - Dados do personagem
     * @param {Object} classData - Dados da classe
     * @returns {number} - Bônus total de armadura
     */
    calculateMovementArmorBonus(char, classData) {
        const acquiredMoves = char.acquiredMoves || [];
        let bonus = 0;
        
        // Coleta todos os movimentos da classe
        const allMoves = [
            ...(classData.startingMoves || []),
            ...(classData.advancedMoves2_5 || []),
            ...(classData.advancedMoves6_10 || [])
        ];
        
        // Verifica movimentos adquiridos que dão bônus de armadura
        acquiredMoves.forEach(moveId => {
            const move = allMoves.find(m => m.id === moveId);
            if (move && move.armorBonus) {
                bonus += move.armorBonus;
            }
        });
        
        // Verifica também movimentos de multiclasse
        const multiclassMoves = char.multiclassMoves || [];
        multiclassMoves.forEach(mcMove => {
            const sourceClass = getClassById(mcMove.fromClass);
            if (sourceClass) {
                const sourceMoves = [
                    ...(sourceClass.startingMoves || []),
                    ...(sourceClass.advancedMoves2_5 || []),
                    ...(sourceClass.advancedMoves6_10 || [])
                ];
                const move = sourceMoves.find(m => m.id === mcMove.moveId);
                if (move && move.armorBonus) {
                    bonus += move.armorBonus;
                }
            }
        });
        
        return bonus;
    },
    
    /**
     * Calcula o nível efetivo de clérigo para personagens com Favor Divino / Deuses em Meio à Desolação
     * @param {Object} char - Dados do personagem (opcional, usa current se não fornecido)
     * @returns {number} - Nível de clérigo (0 se não tiver a habilidade)
     */
    getClericLevel(char = null) {
        const character = char || this.get('character');
        if (!character) return 0;
        
        // Verifica se tem a habilidade que concede níveis de clérigo
        const clericLevelAcquiredAt = character.clericLevelAcquiredAt;
        if (!clericLevelAcquiredAt) return 0;
        
        // Nível de clérigo = nível atual - nível quando adquiriu + 1
        const clericLevel = character.level - clericLevelAcquiredAt + 1;
        
        // Mínimo é 1, máximo é 10
        return Math.max(1, Math.min(10, clericLevel));
    },
    
    /**
     * Verifica se o personagem tem habilidade que concede poderes de clérigo
     * @returns {boolean}
     */
    hasClericSpellAbility() {
        const character = this.get('character');
        if (!character) return false;
        
        return !!character.clericLevelAcquiredAt;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.Store = Store;
}
