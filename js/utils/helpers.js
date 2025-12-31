/**
 * =====================================================
 * DUNGEON WORLD - FUNÇÕES AUXILIARES
 * Utilidades gerais para o sistema
 * =====================================================
 */

const Helpers = {
    /**
     * Calcula o modificador de atributo
     * @param {number} value - Valor do atributo (1-18)
     * @returns {number} - Modificador (-3 a +3)
     */
    calculateModifier(value) {
        if (value <= 3) return -3;
        if (value <= 5) return -2;
        if (value <= 8) return -1;
        if (value <= 12) return 0;
        if (value <= 15) return +1;
        if (value <= 17) return +2;
        return +3;
    },

    /**
     * Formata o modificador para exibição
     * @param {number} mod - Valor do modificador
     * @returns {string} - Modificador formatado (ex: "+2", "-1")
     */
    formatModifier(mod) {
        if (mod >= 0) return `+${mod}`;
        return `${mod}`;
    },

    /**
     * Calcula o PV máximo
     * @param {number} baseHP - PV base da classe
     * @param {number} constitution - Valor de Constituição
     * @returns {number} - PV máximo
     */
    calculateMaxHP(baseHP, constitution) {
        return baseHP + constitution;
    },

    /**
     * Calcula a carga máxima
     * @param {number} baseLoad - Carga base da classe
     * @param {number} strengthMod - Modificador de Força
     * @returns {number} - Carga máxima
     */
    calculateMaxLoad(baseLoad, strengthMod) {
        return baseLoad + strengthMod;
    },

    /**
     * Calcula o XP necessário para subir de nível
     * @param {number} currentLevel - Nível atual
     * @returns {number} - XP necessário
     */
    calculateXPToLevel(currentLevel) {
        return currentLevel + 7;
    },

    /**
     * Gera um ID único
     * @returns {string} - ID único
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Debounce para funções
     * @param {Function} func - Função a ser executada
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} - Função com debounce
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle para funções
     * @param {Function} func - Função a ser executada
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function} - Função com throttle
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Escapa HTML para prevenir XSS
     * @param {string} str - String a ser escapada
     * @returns {string} - String escapada
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Converte texto com marcadores para HTML
     * @param {string} text - Texto com marcadores
     * @returns {string} - HTML formatado
     */
    formatMovementText(text) {
        if (!text) return '';
        
        // Substitui quebras de linha
        let formatted = text.replace(/\n/g, '<br>');
        
        // Destaca resultados de rolagem
        formatted = formatted.replace(/\b(10\+)\b/g, '<span class="roll-success">$1</span>');
        formatted = formatted.replace(/\b(7-9)\b/g, '<span class="roll-partial">$1</span>');
        formatted = formatted.replace(/\b(6-)\b/g, '<span class="roll-fail">$1</span>');
        
        // Formata listas com bullets
        formatted = formatted.replace(/• /g, '<span class="bullet">◆</span> ');
        
        return formatted;
    },

    /**
     * Formata o dado de dano para exibição
     * @param {string} damage - Dado de dano (ex: "d8", "d10")
     * @returns {string} - Dano formatado
     */
    formatDamage(damage) {
        return damage.toUpperCase();
    },

    /**
     * Calcula o peso total de itens
     * @param {Array} items - Array de itens
     * @returns {number} - Peso total
     */
    calculateTotalWeight(items) {
        return items.reduce((total, item) => {
            const weight = item.weight || 0;
            const quantity = item.quantity || 1;
            return total + (weight * quantity);
        }, 0);
    },

    /**
     * Calcula armadura total de itens equipados
     * @param {Array} items - Array de itens
     * @returns {number} - Armadura total
     */
    calculateTotalArmor(items) {
        return items.reduce((total, item) => {
            if (item.equipped && item.armor) {
                return total + item.armor;
            }
            return total;
        }, 0);
    },

    /**
     * Clona profundamente um objeto
     * @param {Object} obj - Objeto a ser clonado
     * @returns {Object} - Clone do objeto
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Exporta personagem para arquivo JSON
     * @param {Object} character - Dados do personagem
     */
    exportCharacter(character) {
        if (!character) return;
        
        const data = JSON.stringify(character, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const name = character.name || 'personagem';
        const className = character.className || 'classe';
        const filename = `${name.toLowerCase().replace(/\s+/g, '_')}_${className.toLowerCase()}_nivel${character.level || 1}.json`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return true;
    },

    /**
     * Importa personagem de arquivo JSON
     * @returns {Promise<Object>} - Dados do personagem
     */
    importCharacter() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) {
                    reject(new Error('Nenhum arquivo selecionado'));
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const character = JSON.parse(event.target.result);
                        
                        // Valida se é um personagem válido
                        if (!character.classId || !character.id) {
                            reject(new Error('Arquivo inválido: não é um personagem de Dungeon World'));
                            return;
                        }
                        
                        resolve(character);
                    } catch (err) {
                        reject(new Error('Erro ao ler arquivo: formato inválido'));
                    }
                };
                reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
                reader.readAsText(file);
            };
            
            input.click();
        });
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.Helpers = Helpers;
}
