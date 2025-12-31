/**
 * DUNGEON WORLD - COMPONENTE: BUSCA (Paladino)
 * Sistema interativo para configurar a busca sagrada do Paladino
 */
const PaladinQuest = {
    render(config, characterData = null) {
        const saved = this.getSaved(characterData);
        const container = document.createElement('div');
        container.className = 'paladin-quest-builder';
        container.id = 'paladin-quest-builder';
        container.innerHTML = `
            <div class="paladin-quest-header">
                <h3 class="paladin-quest-title">⚔️ Busca Sagrada</h3>
                <p class="paladin-quest-description">${config.description}</p>
            </div>
            <div class="paladin-quest-preview" id="paladin-quest-preview"></div>
        `;
        
        // Passo 1: Tipo de missão
        container.appendChild(this.stepMission(config, saved));
        
        // Passo 2: Dádivas
        container.appendChild(this.stepGifts(config, saved));
        
        // Passo 3: Votos (informativo - MJ define)
        container.appendChild(this.stepVows(config, saved));
        
        setTimeout(() => this.updatePreview(), 0);
        return container;
    },

    stepMission(config, saved) {
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        step.innerHTML = `
            <div class="step-header">
                <span class="step-number">1</span>
                <span class="step-title">Diga o que pretende fazer:</span>
            </div>
            <div class="step-options step-options-mission">
                ${config.questOptions.map((opt, i) => {
                    const hasBlank = opt.includes('________________');
                    const isSelected = saved?.missionType === i;
                    const savedText = saved?.missionTarget || '';
                    
                    if (hasBlank) {
                        const parts = opt.split('________________');
                        if (isSelected) {
                            // Selecionado: mostra input editável
                            return `
                                <label class="step-option mission-option selected">
                                    <input type="radio" name="quest-mission" value="${i}" checked>
                                    <span class="option-text">
                                        ${parts[0]}<input type="text" class="mission-target-input" 
                                            data-mission="${i}" 
                                            placeholder="________________" 
                                            value="${savedText}"
                                            maxlength="50">${parts[1] || ''}
                                    </span>
                                </label>
                            `;
                        } else {
                            // Não selecionado: mostra texto puro com underlines
                            return `
                                <label class="step-option mission-option">
                                    <input type="radio" name="quest-mission" value="${i}">
                                    <span class="option-text">${opt}</span>
                                </label>
                            `;
                        }
                    }
                    return `
                        <label class="step-option mission-option ${isSelected ? 'selected' : ''}">
                            <input type="radio" name="quest-mission" value="${i}" ${isSelected ? 'checked' : ''}>
                            <span class="option-text">${opt}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
        
        setTimeout(() => {
            this.bindMissionEvents(step, config);
        }, 0);
        
        return step;
    },

    bindMissionEvents(step, config) {
        // Evento para seleção de missão
        step.querySelectorAll('input[name="quest-mission"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const missionIndex = parseInt(radio.value);
                this.save('missionType', missionIndex);
                this.save('missionTarget', '');
                
                // Re-renderiza as opções
                this.rebuildMissionOptions(step, config);
            });
        });
        
        // Evento para input de texto da missão
        step.querySelectorAll('.mission-target-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.save('missionTarget', e.target.value);
            });
        });
    },

    rebuildMissionOptions(step, config) {
        const saved = this.getSaved();
        const optionsContainer = step.querySelector('.step-options-mission');
        
        optionsContainer.innerHTML = config.questOptions.map((opt, i) => {
            const hasBlank = opt.includes('________________');
            const isSelected = saved?.missionType === i;
            const savedText = saved?.missionTarget || '';
            
            if (hasBlank) {
                const parts = opt.split('________________');
                if (isSelected) {
                    return `
                        <label class="step-option mission-option selected">
                            <input type="radio" name="quest-mission" value="${i}" checked>
                            <span class="option-text">
                                ${parts[0]}<input type="text" class="mission-target-input" 
                                    data-mission="${i}" 
                                    placeholder="________________" 
                                    value="${savedText}"
                                    maxlength="50">${parts[1] || ''}
                            </span>
                        </label>
                    `;
                } else {
                    return `
                        <label class="step-option mission-option">
                            <input type="radio" name="quest-mission" value="${i}">
                            <span class="option-text">${opt}</span>
                        </label>
                    `;
                }
            }
            return `
                <label class="step-option mission-option ${isSelected ? 'selected' : ''}">
                    <input type="radio" name="quest-mission" value="${i}" ${isSelected ? 'checked' : ''}>
                    <span class="option-text">${opt}</span>
                </label>
            `;
        }).join('');
        
        // Re-bind events
        this.bindMissionEvents(step, config);
        
        // Focus no input se houver
        const input = optionsContainer.querySelector('.mission-target-input');
        if (input) input.focus();
    },

    stepGifts(config, saved) {
        const maxGifts = this.getMaxGifts();
        const selectedGifts = saved?.gifts || [];
        
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        step.id = 'paladin-quest-gifts-step';
        step.innerHTML = `
            <div class="step-header">
                <span class="step-number">2</span>
                <span class="step-title">${config.giftNote}</span>
                <span class="step-counter" id="gifts-counter">${selectedGifts.length}/${maxGifts}</span>
            </div>
            <div class="step-options step-options-gifts">
                ${config.gifts.map((gift, i) => {
                    const hasBlank = gift.includes('________________');
                    const isSelected = selectedGifts.some(g => g.index === i);
                    const savedData = selectedGifts.find(g => g.index === i);
                    const isDisabled = !isSelected && selectedGifts.length >= maxGifts;
                    
                    if (hasBlank) {
                        const parts = gift.split('________________');
                        if (isSelected) {
                            // Selecionado: mostra input editável
                            return `
                                <label class="step-option gift-option selected">
                                    <input type="checkbox" name="quest-gift" value="${i}" checked>
                                    <span class="option-text">
                                        ${parts[0]}<input type="text" class="gift-target-input" 
                                            data-gift="${i}" 
                                            placeholder="________________" 
                                            value="${savedData?.target || ''}"
                                            maxlength="50">${parts[1] || ''}
                                    </span>
                                </label>
                            `;
                        } else {
                            // Não selecionado: mostra texto puro com underlines
                            return `
                                <label class="step-option gift-option ${isDisabled ? 'disabled' : ''}">
                                    <input type="checkbox" name="quest-gift" value="${i}" ${isDisabled ? 'disabled' : ''}>
                                    <span class="option-text">${gift}</span>
                                </label>
                            `;
                        }
                    }
                    return `
                        <label class="step-option gift-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}">
                            <input type="checkbox" name="quest-gift" value="${i}" 
                                ${isSelected ? 'checked' : ''} 
                                ${isDisabled ? 'disabled' : ''}>
                            <span class="option-text">${gift}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
        
        setTimeout(() => {
            this.bindGiftEvents(step, config);
        }, 0);
        
        return step;
    },

    bindGiftEvents(step, config) {
        step.querySelectorAll('input[name="quest-gift"]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.handleGiftChange(step, config);
            });
        });
        
        step.querySelectorAll('.gift-target-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const giftIndex = parseInt(e.target.dataset.gift);
                const saved = this.getSaved();
                const gifts = saved?.gifts || [];
                const gift = gifts.find(g => g.index === giftIndex);
                if (gift) {
                    gift.target = e.target.value;
                    this.save('gifts', gifts);
                }
            });
        });
    },

    handleGiftChange(step, config) {
        const maxGifts = this.getMaxGifts();
        const checkboxes = step.querySelectorAll('input[name="quest-gift"]');
        const selectedGifts = [];
        
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const index = parseInt(cb.value);
                const targetInput = step.querySelector(`.gift-target-input[data-gift="${index}"]`);
                selectedGifts.push({
                    index,
                    text: config.gifts[index],
                    target: targetInput?.value || ''
                });
            }
        });
        
        this.save('gifts', selectedGifts);
        
        // Re-renderiza as opções
        this.rebuildGiftOptions(step, config);
    },

    rebuildGiftOptions(step, config) {
        const saved = this.getSaved();
        const selectedGifts = saved?.gifts || [];
        const maxGifts = this.getMaxGifts();
        const optionsContainer = step.querySelector('.step-options-gifts');
        
        optionsContainer.innerHTML = config.gifts.map((gift, i) => {
            const hasBlank = gift.includes('________________');
            const isSelected = selectedGifts.some(g => g.index === i);
            const savedData = selectedGifts.find(g => g.index === i);
            const isDisabled = !isSelected && selectedGifts.length >= maxGifts;
            
            if (hasBlank) {
                const parts = gift.split('________________');
                if (isSelected) {
                    return `
                        <label class="step-option gift-option selected">
                            <input type="checkbox" name="quest-gift" value="${i}" checked>
                            <span class="option-text">
                                ${parts[0]}<input type="text" class="gift-target-input" 
                                    data-gift="${i}" 
                                    placeholder="________________" 
                                    value="${savedData?.target || ''}"
                                    maxlength="50">${parts[1] || ''}
                            </span>
                        </label>
                    `;
                } else {
                    return `
                        <label class="step-option gift-option ${isDisabled ? 'disabled' : ''}">
                            <input type="checkbox" name="quest-gift" value="${i}" ${isDisabled ? 'disabled' : ''}>
                            <span class="option-text">${gift}</span>
                        </label>
                    `;
                }
            }
            return `
                <label class="step-option gift-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}">
                    <input type="checkbox" name="quest-gift" value="${i}" 
                        ${isSelected ? 'checked' : ''} 
                        ${isDisabled ? 'disabled' : ''}>
                    <span class="option-text">${gift}</span>
                </label>
            `;
        }).join('');
        
        // Atualiza contador
        const counter = step.querySelector('#gifts-counter');
        if (counter) {
            counter.textContent = `${selectedGifts.length}/${maxGifts}`;
            counter.classList.toggle('complete', selectedGifts.length === maxGifts);
        }
        
        // Re-bind events
        this.bindGiftEvents(step, config);
    },

    stepVows(config, saved) {
        const selectedVows = saved?.vows || [];
        
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        step.innerHTML = `
            <div class="step-header">
                <span class="step-number">3</span>
                <span class="step-title">${config.vowNote}</span>
            </div>
            <div class="step-info">
                <span>ℹ️</span> Os votos são definidos pelo MJ. Marque abaixo os votos que você deve manter.
            </div>
            <div class="step-options step-options-vows">
                ${config.vows.map(vow => {
                    const isSelected = selectedVows.includes(vow.id);
                    return `
                        <label class="step-option vow-option ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" name="quest-vow" value="${vow.id}" ${isSelected ? 'checked' : ''}>
                            <span class="option-text">
                                <strong>${vow.name}</strong>
                                <span class="vow-restriction">(${vow.restriction})</span>
                            </span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
        
        setTimeout(() => {
            step.querySelectorAll('input[name="quest-vow"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    const selectedVows = [...step.querySelectorAll('input[name="quest-vow"]:checked')]
                        .map(c => c.value);
                    this.save('vows', selectedVows);
                    
                    step.querySelectorAll('.vow-option').forEach(opt => {
                        opt.classList.toggle('selected', opt.querySelector('input').checked);
                    });
                });
            });
        }, 0);
        
        return step;
    },

    getMaxGifts() {
        const char = Store.get('character');
        const acquiredMoves = char?.acquiredMoves || [];
        // Prova de Fé concede 3 dádivas ao invés de 2
        return acquiredMoves.includes('prova_fe') ? 3 : 2;
    },

    save(key, value) {
        const char = Store.get('character');
        if (!char) return;
        char.classSpecific = char.classSpecific || {};
        char.classSpecific.paladinQuest = char.classSpecific.paladinQuest || {};
        char.classSpecific.paladinQuest[key] = value;
        Store.setCharacterProperty('classSpecific.paladinQuest', char.classSpecific.paladinQuest);
        this.updatePreview();
    },

    updatePreview() {
        const preview = document.getElementById('paladin-quest-preview');
        if (!preview) return;
        
        const saved = this.getSaved();
        const config = CLASS_PALADINO?.quest;
        
        if (!config || saved?.missionType === undefined) {
            preview.innerHTML = `
                <div class="paladin-quest-preview-empty">
                    <span class="preview-icon">⚔️</span>
                    <span class="preview-text">Configure sua busca sagrada abaixo</span>
                </div>
            `;
            return;
        }
        
        // Monta a missão
        let missionText = config.questOptions[saved.missionType];
        if (saved.missionTarget) {
            missionText = missionText.replace('________________', `<strong>${saved.missionTarget}</strong>`);
        } else {
            missionText = missionText.replace('________________', '<em>___</em>');
        }
        
        // Monta as dádivas
        const giftsHtml = (saved.gifts || []).map(gift => {
            let text = gift.text;
            if (gift.target) {
                text = text.replace('________________', `<strong>${gift.target}</strong>`);
            } else if (text.includes('________________')) {
                text = text.replace('________________', '<em>___</em>');
            }
            return `<span class="quest-tag tag-gift">${text}</span>`;
        }).join('');
        
        // Monta os votos
        const vowsHtml = (saved.vows || []).map(vowId => {
            const vow = config.vows.find(v => v.id === vowId);
            return vow ? `<span class="quest-tag tag-vow"><strong>${vow.name}</strong></span>` : '';
        }).join('');
        
        preview.innerHTML = `
            <div class="quest-preview-section">
                <span class="section-label">🎯 Missão:</span>
                <div class="quest-mission-text">${missionText}</div>
            </div>
            ${giftsHtml ? `
                <div class="quest-preview-section">
                    <span class="section-label">✨ Dádivas:</span>
                    <div class="quest-tags">${giftsHtml}</div>
                </div>
            ` : ''}
            ${vowsHtml ? `
                <div class="quest-preview-section">
                    <span class="section-label">📜 Votos:</span>
                    <div class="quest-tags">${vowsHtml}</div>
                </div>
            ` : ''}
        `;
    },

    getSaved(char = null) {
        return (char || Store.get('character'))?.classSpecific?.paladinQuest || null;
    },

    getQuest(char = null) {
        const saved = this.getSaved(char);
        const config = CLASS_PALADINO?.quest;
        if (!saved || !config) return null;
        
        return {
            missionType: saved.missionType,
            missionTarget: saved.missionTarget || '',
            missionText: config.questOptions[saved.missionType] || '',
            gifts: saved.gifts || [],
            vows: saved.vows || []
        };
    }
};

if (typeof window !== 'undefined') window.PaladinQuest = PaladinQuest;
