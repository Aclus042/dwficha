/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: AVATAR DO PERSONAGEM
 * Sistema de upload, posicionamento e zoom de foto
 * =====================================================
 */

const CharacterAvatar = {
    // Estado do editor
    editorState: {
        image: null,
        imageUrl: null,
        zoom: 1,
        minZoom: 1,
        maxZoom: 3,
        posX: 0,
        posY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        imgWidth: 0,
        imgHeight: 0
    },

    /**
     * Inicializa o avatar no badge da classe
     * @param {HTMLElement} badge - Elemento do badge
     */
    init(badge) {
        if (!badge) return;
        
        const character = Store.get('character');
        const avatar = character?.avatar;
        
        // Renderiza o estado atual
        this.renderBadge(badge, avatar);
        
        // Adiciona evento de clique para abrir editor
        badge.addEventListener('click', () => this.openEditor());
    },

    /**
     * Renderiza o badge com ou sem avatar
     * @param {HTMLElement} badge - Elemento do badge
     * @param {Object} avatar - Dados do avatar salvo
     */
    renderBadge(badge, avatar) {
        // Remove elementos anteriores de avatar
        const existingImg = badge.querySelector('.avatar-image');
        const existingOverlay = badge.querySelector('.avatar-overlay');
        if (existingImg) existingImg.remove();
        if (existingOverlay) existingOverlay.remove();
        
        if (avatar && avatar.imageData) {
            badge.classList.add('has-avatar');
            
            // Cria imagem do avatar
            const img = document.createElement('img');
            img.className = 'avatar-image';
            img.src = avatar.imageData;
            
            // O editor usa 200px, o badge usa 60px
            // Precisa escalar proporcionalmente
            const editorSize = 200;
            const badgeSize = 60;
            const scaleFactor = badgeSize / editorSize; // 0.3
            
            const offsetX = (avatar.posX || 0) * scaleFactor;
            const offsetY = (avatar.posY || 0) * scaleFactor;
            const zoom = (avatar.zoom || 1) * scaleFactor;
            
            img.style.transform = `scale(${zoom})`;
            img.style.transformOrigin = '0 0';
            img.style.left = `${offsetX}px`;
            img.style.top = `${offsetY}px`;
            img.alt = 'Avatar do personagem';
            
            badge.insertBefore(img, badge.firstChild);
            
            // Esconde o ícone da classe
            const classIcon = badge.querySelector('.class-icon');
            if (classIcon) classIcon.style.display = 'none';
        } else {
            badge.classList.remove('has-avatar');
            
            // Mostra o ícone da classe
            const classIcon = badge.querySelector('.class-icon');
            if (classIcon) classIcon.style.display = '';
        }
        
        // Adiciona overlay de edição
        let overlay = badge.querySelector('.avatar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'avatar-overlay';
            overlay.innerHTML = '<span class="avatar-overlay-icon">📷</span>';
            badge.appendChild(overlay);
        }
    },

    /**
     * Abre o editor de avatar
     */
    openEditor() {
        // Reseta estado
        this.resetEditorState();
        
        // Carrega avatar existente se houver
        const character = Store.get('character');
        if (character?.avatar?.imageData) {
            this.loadExistingAvatar(character.avatar);
        }
        
        // Cria e mostra o modal
        this.createEditorModal();
    },

    /**
     * Reseta o estado do editor
     */
    resetEditorState() {
        this.editorState = {
            image: null,
            imageUrl: null,
            zoom: 1,
            minZoom: 1,
            maxZoom: 3,
            posX: 0,
            posY: 0,
            isDragging: false,
            dragStartX: 0,
            dragStartY: 0,
            imgWidth: 0,
            imgHeight: 0
        };
    },

    /**
     * Carrega avatar existente no editor
     * @param {Object} avatar - Dados do avatar
     */
    loadExistingAvatar(avatar) {
        this.editorState.imageUrl = avatar.imageData;
        this.editorState.zoom = avatar.zoom || 1;
        this.editorState.posX = avatar.posX || 0;
        this.editorState.posY = avatar.posY || 0;
    },

    /**
     * Cria o modal de edição
     */
    createEditorModal() {
        // Remove modal anterior se existir
        const existingModal = document.getElementById('avatar-editor-modal');
        if (existingModal) existingModal.remove();
        
        const character = Store.get('character');
        const hasAvatar = character?.avatar?.imageData;
        
        const modal = document.createElement('div');
        modal.id = 'avatar-editor-modal';
        modal.className = 'avatar-editor-overlay';
        
        modal.innerHTML = `
            <div class="avatar-editor-container">
                <div class="avatar-editor-header">
                    <h3 class="avatar-editor-title">📷 Foto do Personagem</h3>
                    <button type="button" class="avatar-editor-close">&times;</button>
                </div>
                <div class="avatar-editor-body">
                    ${this.editorState.imageUrl ? this.renderCropArea() : this.renderUploadZone()}
                </div>
                <div class="avatar-editor-footer">
                    ${this.editorState.imageUrl ? `
                        <button type="button" class="avatar-btn avatar-btn-confirm">✓ Confirmar</button>
                        ${hasAvatar ? `<button type="button" class="avatar-btn avatar-btn-remove">🗑️ Remover</button>` : ''}
                        <button type="button" class="avatar-btn avatar-btn-cancel">Cancelar</button>
                    ` : `
                        <button type="button" class="avatar-btn avatar-btn-cancel">Cancelar</button>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ativa o modal com animação
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Bind eventos
        this.bindEditorEvents(modal);
        
        // Se tem imagem, inicializa a área de crop
        if (this.editorState.imageUrl) {
            this.initCropArea(modal);
        }
    },

    /**
     * Renderiza a área de upload
     * @returns {string} HTML
     */
    renderUploadZone() {
        return `
            <div class="avatar-upload-zone">
                <span class="avatar-upload-icon">📤</span>
                <span class="avatar-upload-text">Clique ou arraste uma imagem</span>
                <span class="avatar-upload-hint">JPG, PNG ou GIF</span>
                <input type="file" class="avatar-upload-input" accept="image/*">
            </div>
        `;
    },

    /**
     * Renderiza a área de crop/edição
     * @returns {string} HTML
     */
    renderCropArea() {
        return `
            <div class="avatar-crop-area">
                <img class="avatar-crop-image" src="${this.editorState.imageUrl}" alt="Preview">
                <div class="avatar-crop-guide"></div>
            </div>
            <div class="avatar-zoom-controls">
                <span class="avatar-zoom-label">🔍</span>
                <input type="range" class="avatar-zoom-slider" 
                       min="100" max="300" value="${this.editorState.zoom * 100}">
                <span class="avatar-zoom-label">🔎</span>
            </div>
            <div class="avatar-instructions">
                Arraste para posicionar • Use o slider para zoom
            </div>
        `;
    },

    /**
     * Bind dos eventos do editor
     * @param {HTMLElement} modal - Elemento do modal
     */
    bindEditorEvents(modal) {
        // Fechar modal
        modal.querySelector('.avatar-editor-close').addEventListener('click', () => this.closeEditor());
        modal.querySelector('.avatar-btn-cancel')?.addEventListener('click', () => this.closeEditor());
        
        // Clique fora fecha
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeEditor();
        });
        
        // Upload zone
        const uploadZone = modal.querySelector('.avatar-upload-zone');
        const uploadInput = modal.querySelector('.avatar-upload-input');
        
        if (uploadZone && uploadInput) {
            uploadZone.addEventListener('click', () => uploadInput.click());
            
            uploadInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
            
            // Drag and drop
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.classList.add('dragover');
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.classList.remove('dragover');
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    this.handleImageUpload(e.dataTransfer.files[0]);
                }
            });
        }
        
        // Confirmar
        modal.querySelector('.avatar-btn-confirm')?.addEventListener('click', () => this.saveAvatar());
        
        // Remover
        modal.querySelector('.avatar-btn-remove')?.addEventListener('click', () => this.removeAvatar());
    },

    /**
     * Inicializa a área de crop
     * @param {HTMLElement} modal - Elemento do modal
     */
    initCropArea(modal) {
        const cropArea = modal.querySelector('.avatar-crop-area');
        const cropImage = modal.querySelector('.avatar-crop-image');
        const zoomSlider = modal.querySelector('.avatar-zoom-slider');
        
        if (!cropArea || !cropImage) return;
        
        // Aguarda a imagem carregar
        const img = new Image();
        img.onload = () => {
            this.editorState.imgWidth = img.naturalWidth;
            this.editorState.imgHeight = img.naturalHeight;
            
            // Calcula zoom mínimo para cobrir a área
            const areaSize = 200;
            const minZoomX = areaSize / img.naturalWidth;
            const minZoomY = areaSize / img.naturalHeight;
            this.editorState.minZoom = Math.max(minZoomX, minZoomY);
            
            // Ajusta zoom inicial se necessário
            if (this.editorState.zoom < this.editorState.minZoom) {
                this.editorState.zoom = this.editorState.minZoom;
            }
            
            // Atualiza slider
            if (zoomSlider) {
                zoomSlider.min = Math.floor(this.editorState.minZoom * 100);
                zoomSlider.max = Math.floor(this.editorState.minZoom * 100 * 3);
                zoomSlider.value = Math.floor(this.editorState.zoom * 100);
            }
            
            this.updateCropImage(cropImage);
        };
        img.src = this.editorState.imageUrl;
        
        // Eventos de arrastar
        cropArea.addEventListener('mousedown', (e) => this.startDrag(e));
        cropArea.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
        
        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
        
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
        
        // Zoom com scroll
        cropArea.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            this.adjustZoom(delta, zoomSlider, cropImage);
        }, { passive: false });
        
        // Zoom com slider
        zoomSlider?.addEventListener('input', (e) => {
            this.editorState.zoom = parseFloat(e.target.value) / 100;
            this.updateCropImage(cropImage);
        });
    },

    /**
     * Inicia o arrasto
     * @param {Event} e - Evento
     */
    startDrag(e) {
        e.preventDefault();
        this.editorState.isDragging = true;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.editorState.dragStartX = clientX - this.editorState.posX;
        this.editorState.dragStartY = clientY - this.editorState.posY;
    },

    /**
     * Durante o arrasto
     * @param {Event} e - Evento
     */
    onDrag(e) {
        if (!this.editorState.isDragging) return;
        e.preventDefault();
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        this.editorState.posX = clientX - this.editorState.dragStartX;
        this.editorState.posY = clientY - this.editorState.dragStartY;
        
        const cropImage = document.querySelector('.avatar-crop-image');
        if (cropImage) {
            this.updateCropImage(cropImage);
        }
    },

    /**
     * Termina o arrasto
     */
    endDrag() {
        this.editorState.isDragging = false;
    },

    /**
     * Ajusta o zoom
     * @param {number} delta - Variação do zoom
     * @param {HTMLElement} slider - Elemento do slider
     * @param {HTMLElement} cropImage - Elemento da imagem
     */
    adjustZoom(delta, slider, cropImage) {
        const newZoom = this.editorState.zoom + delta;
        const minZoom = this.editorState.minZoom;
        const maxZoom = minZoom * 3;
        
        if (newZoom >= minZoom && newZoom <= maxZoom) {
            this.editorState.zoom = newZoom;
            
            if (slider) {
                slider.value = Math.floor(newZoom * 100);
            }
            
            this.updateCropImage(cropImage);
        }
    },

    /**
     * Atualiza a imagem no crop
     * @param {HTMLElement} cropImage - Elemento da imagem
     */
    updateCropImage(cropImage) {
        if (!cropImage) return;
        
        const { zoom, posX, posY, imgWidth, imgHeight } = this.editorState;
        const areaSize = 200;
        
        // Calcula dimensões da imagem escalada mantendo proporção
        const scaledWidth = imgWidth * zoom;
        const scaledHeight = imgHeight * zoom;
        
        // Limita a posição para não sair da área
        const minX = areaSize - scaledWidth;
        const maxX = 0;
        const minY = areaSize - scaledHeight;
        const maxY = 0;
        
        const clampedX = Math.max(minX, Math.min(maxX, posX));
        const clampedY = Math.max(minY, Math.min(maxY, posY));
        
        // Atualiza posição no estado
        this.editorState.posX = clampedX;
        this.editorState.posY = clampedY;
        
        // Usa transform para escalar (mantém proporção) e position para mover
        cropImage.style.transform = `scale(${zoom})`;
        cropImage.style.transformOrigin = '0 0';
        cropImage.style.left = `${clampedX}px`;
        cropImage.style.top = `${clampedY}px`;
    },

    /**
     * Manipula upload de imagem
     * @param {File} file - Arquivo de imagem
     */
    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem válida.');
            return;
        }
        
        // Limita tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.editorState.imageUrl = e.target.result;
            this.editorState.zoom = 1;
            this.editorState.posX = 0;
            this.editorState.posY = 0;
            
            // Recria o modal com a área de crop
            this.createEditorModal();
        };
        reader.readAsDataURL(file);
    },

    /**
     * Salva o avatar
     */
    saveAvatar() {
        const avatar = {
            imageData: this.editorState.imageUrl,
            zoom: this.editorState.zoom,
            posX: this.editorState.posX,
            posY: this.editorState.posY
        };
        
        // Salva no store
        Store.setCharacterProperty('avatar', avatar);
        
        // Atualiza o badge
        const badge = document.querySelector('.sheet-class-badge');
        if (badge) {
            this.renderBadge(badge, avatar);
        }
        
        this.closeEditor();
    },

    /**
     * Remove o avatar
     */
    removeAvatar() {
        // Remove do store
        Store.setCharacterProperty('avatar', null);
        
        // Atualiza o badge
        const badge = document.querySelector('.sheet-class-badge');
        if (badge) {
            this.renderBadge(badge, null);
        }
        
        this.closeEditor();
    },

    /**
     * Fecha o editor
     */
    closeEditor() {
        const modal = document.getElementById('avatar-editor-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
        
        // Remove event listeners globais
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.endDrag);
        document.removeEventListener('touchmove', this.onDrag);
        document.removeEventListener('touchend', this.endDrag);
    }
};

// Exporta para uso global
window.CharacterAvatar = CharacterAvatar;
