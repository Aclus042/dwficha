/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: CARTÃO DE CLASSE
 * Renderiza um cartão de seleção de classe
 * =====================================================
 */

const ClassCard = {
    /**
     * Renderiza um cartão de classe
     * @param {Object} classData - Dados da classe
     * @param {Object} displayData - Dados de exibição (ícone, cor)
     * @returns {HTMLElement} - Elemento do cartão
     */
    render(classData, displayData) {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.setAttribute('data-class', classData.id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Selecionar classe ${classData.name}`);

        // Aplica cor específica da classe
        if (displayData && displayData.color) {
            card.style.setProperty('--class-color', displayData.color);
        }

        card.innerHTML = `
            <div class="class-card-icon">
                <span>${displayData ? displayData.icon : '⚔️'}</span>
            </div>
            <div class="class-card-content">
                <h3 class="class-card-name">${classData.name}</h3>
                <p class="class-card-description">${classData.description}</p>
                <div class="class-card-stats">
                    <span class="class-stat" title="Pontos de Vida base">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-value">${classData.baseHP} + CON</span>
                    </span>
                    <span class="class-stat" title="Dano base">
                        <span class="stat-icon">⚔️</span>
                        <span class="stat-value">${classData.baseDamage}</span>
                    </span>
                </div>
            </div>
            <div class="class-card-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </div>
        `;

        // Eventos de interação
        card.addEventListener('click', () => this.handleSelect(classData.id));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleSelect(classData.id);
            }
        });

        // Efeito hover com preview
        card.addEventListener('mouseenter', () => {
            card.classList.add('class-card-hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('class-card-hover');
        });

        return card;
    },

    /**
     * Renderiza uma lista de cartões de classe
     * @param {Array} classes - Lista de classes
     * @returns {DocumentFragment} - Fragmento com os cartões
     */
    renderList(classes) {
        const fragment = document.createDocumentFragment();
        
        classes.forEach((classData, index) => {
            const displayData = CLASS_LIST.find(c => c.id === classData.id);
            const card = this.render(classData, displayData);
            
            // Animação escalonada
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
            
            fragment.appendChild(card);
        });

        return fragment;
    },

    /**
     * Manipula a seleção de uma classe
     * @param {string} classId - ID da classe selecionada
     */
    handleSelect(classId) {
        // Cria o personagem com a classe selecionada
        const character = Store.createCharacter(classId);
        
        if (character) {
            // Navega para a ficha de personagem
            Store.navigateTo('character-sheet');
            
            // Dispara evento customizado
            document.dispatchEvent(new CustomEvent('classSelected', {
                detail: { classId, character }
            }));
        } else {
            console.error(`Falha ao criar personagem com classe: ${classId}`);
        }
    },

    /**
     * Renderiza uma versão compacta do cartão para exibição
     * @param {Object} classData - Dados da classe
     * @param {Object} displayData - Dados de exibição
     * @returns {HTMLElement} - Elemento compacto
     */
    renderCompact(classData, displayData) {
        const compact = document.createElement('div');
        compact.className = 'class-badge';
        
        if (displayData && displayData.color) {
            compact.style.setProperty('--class-color', displayData.color);
        }

        compact.innerHTML = `
            <span class="class-badge-icon">${displayData ? displayData.icon : '⚔️'}</span>
            <span class="class-badge-name">${classData.name}</span>
        `;

        return compact;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.ClassCard = ClassCard;
}
