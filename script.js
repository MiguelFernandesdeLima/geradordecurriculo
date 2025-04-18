document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const resumeForm = document.getElementById('resume-form');
    const generateBtn = document.getElementById('generate-resume');
    const resetBtn = document.getElementById('reset-form');
    const exportBtn = document.getElementById('export-pdf');
    const resumePreview = document.getElementById('resume-preview');
    
    // Containers para itens dinâmicos
    const experienceContainer = document.getElementById('experience-container');
    const educationContainer = document.getElementById('education-container');
    const skillsContainer = document.getElementById('skills-container');
    
    // Templates
    const experienceTemplate = document.getElementById('experience-template');
    const educationTemplate = document.getElementById('education-template');
    const skillTemplate = document.getElementById('skill-template');
    
    // Adiciona experiência
    document.getElementById('add-experience').addEventListener('click', function() {
        addDynamicItem(experienceContainer, experienceTemplate);
    });
    
    // Adiciona formação
    document.getElementById('add-education').addEventListener('click', function() {
        addDynamicItem(educationContainer, educationTemplate);
    });
    
    // Adiciona habilidade
    document.getElementById('add-skill').addEventListener('click', function() {
        addDynamicItem(skillsContainer, skillTemplate);
    });
    
    // Função para adicionar itens dinâmicos
    function addDynamicItem(container, template) {
        const clone = template.content.cloneNode(true);
        const removeBtn = clone.querySelector('.remove-btn');
        
        removeBtn.addEventListener('click', function() {
            container.removeChild(this.closest('.dynamic-item'));
        });
        
        container.appendChild(clone);
    }
    
    // Gerar currículo
    generateBtn.addEventListener('click', function() {
        const formData = getFormData();
        generateResume(formData);
        exportBtn.disabled = false;
    });
    
    // Resetar formulário
    resetBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todo o formulário?')) {
            resumeForm.reset();
            experienceContainer.innerHTML = '';
            educationContainer.innerHTML = '';
            skillsContainer.innerHTML = '';
            resumePreview.innerHTML = `
                <div class="template-message">
                    <i class="fas fa-file-alt"></i>
                    <p>Preencha o formulário ao lado para gerar seu currículo</p>
                </div>
            `;
            exportBtn.disabled = true;
        }
    });
    
    // Exportar para PDF
    exportBtn.addEventListener('click', exportToPDF);
    
    // Obter dados do formulário
    function getFormData() {
        const formData = {
            personal: {
                name: document.getElementById('name').value,
                profession: document.getElementById('profession').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                linkedin: document.getElementById('linkedin').value
            },
            summary: document.getElementById('summary').value,
            experiences: [],
            education: [],
            skills: []
        };
        
        // Obter experiências
        document.querySelectorAll('#experience-container .dynamic-item').forEach(item => {
            formData.experiences.push({
                company: item.querySelector('.company').value,
                position: item.querySelector('.position').value,
                period: item.querySelector('.period').value,
                location: item.querySelector('.location').value,
                description: item.querySelector('.description').value
            });
        });
        
        // Obter formações
        document.querySelectorAll('#education-container .dynamic-item').forEach(item => {
            formData.education.push({
                institution: item.querySelector('.institution').value,
                course: item.querySelector('.course').value,
                period: item.querySelector('.period').value,
                degree: item.querySelector('.degree').value
            });
        });
        
        // Obter habilidades
        document.querySelectorAll('#skills-container .dynamic-item').forEach(item => {
            formData.skills.push({
                name: item.querySelector('.skill-name').value,
                level: item.querySelector('.skill-level').value
            });
        });
        
        return formData;
    }
    
    // Gerar HTML do currículo
    function generateResume(data) {
        if (!data.personal.name) {
            alert('Por favor, preencha pelo menos seu nome para gerar o currículo');
            return;
        }
        
        let resumeHTML = `
            <div class="resume">
                <header class="resume-header">
                    <h1>${data.personal.name}</h1>
                    <div class="profession">${data.personal.profession || 'Profissional'}</div>
                    <div class="contact-info">
        `;
        
        // Adicionar informações de contato
        if (data.personal.email) {
            resumeHTML += `
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${data.personal.email}</span>
                </div>
            `;
        }
        
        if (data.personal.phone) {
            resumeHTML += `
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${data.personal.phone}</span>
                </div>
            `;
        }
        
        if (data.personal.address) {
            resumeHTML += `
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${data.personal.address}</span>
                </div>
            `;
        }
        
        if (data.personal.linkedin) {
            resumeHTML += `
                <div class="contact-item">
                    <i class="fab fa-linkedin"></i>
                    <span>${data.personal.linkedin}</span>
                </div>
            `;
        }
        
        resumeHTML += `
                    </div>
                </header>
        `;
        
        // Adicionar resumo profissional
        if (data.summary) {
            resumeHTML += `
                <section class="section">
                    <h2 class="section-title">Resumo Profissional</h2>
                    <div class="section-content">
                        <p class="item-description">${data.summary.replace(/\n/g, '<br>')}</p>
                    </div>
                </section>
            `;
        }
        
        // Adicionar experiências profissionais
        if (data.experiences.length > 0) {
            resumeHTML += `
                <section class="section">
                    <h2 class="section-title">Experiência Profissional</h2>
                    <div class="section-content">
            `;
            
            data.experiences.forEach(exp => {
                resumeHTML += `
                    <div class="experience-item">
                        <div class="item-header">
                            <div class="item-title">${exp.company || 'Empresa'}</div>
                            <div class="item-period">${exp.period || 'Período'}</div>
                        </div>
                        <div class="item-subtitle">${exp.position || 'Cargo'}</div>
                        ${exp.location ? `<div class="item-subtitle">${exp.location}</div>` : ''}
                        ${exp.description ? `<p class="item-description">${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                `;
            });
            
            resumeHTML += `
                    </div>
                </section>
            `;
        }
        
        // Adicionar formação acadêmica
        if (data.education.length > 0) {
            resumeHTML += `
                <section class="section">
                    <h2 class="section-title">Formação Acadêmica</h2>
                    <div class="section-content">
            `;
            
            data.education.forEach(edu => {
                resumeHTML += `
                    <div class="education-item">
                        <div class="item-header">
                            <div class="item-title">${edu.institution || 'Instituição'}</div>
                            <div class="item-period">${edu.period || 'Período'}</div>
                        </div>
                        <div class="item-subtitle">${edu.course || 'Curso'}</div>
                        ${edu.degree ? `<div class="item-subtitle">${edu.degree}</div>` : ''}
                    </div>
                `;
            });
            
            resumeHTML += `
                    </div>
                </section>
            `;
        }
        
        // Adicionar habilidades
        if (data.skills.length > 0) {
            resumeHTML += `
                <section class="section">
                    <h2 class="section-title">Habilidades</h2>
                    <div class="section-content">
                        <div class="skills-list">
            `;
            
            data.skills.forEach(skill => {
                if (skill.name) {
                    resumeHTML += `
                        <div class="skill-tag ${skill.level.toLowerCase()}">${skill.name} <small>(${skill.level})</small></div>
                    `;
                }
            });
            
            resumeHTML += `
                        </div>
                    </div>
                </section>
            `;
        }
        
        resumeHTML += `</div>`;
        resumePreview.innerHTML = resumeHTML;
    }
    
    // Exportar para PDF
    function exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');
        
        // Configurações melhoradas
        const options = {
            scale: 1, // Reduz a escala para melhor ajuste
            useCORS: true,
            logging: false,
            scrollY: 0, // Remove scroll desnecessário
            windowHeight: resumePreview.scrollHeight
        };
    
        // Tamanho da página A4 em pixels (considerando 72dpi)
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Mostrar estado de carregamento
        exportBtn.disabled = true;
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando PDF...';
    
        html2canvas(resumePreview, options).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pageWidth - 40; // Margens laterais
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 60; // Posição inicial
            const margin = 20;
            
            // Adiciona a primeira página
            doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Adiciona páginas adicionais se necessário
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            doc.save('curriculo.pdf');
            
            // Restaura o botão
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Exportar para PDF';
        }).catch(err => {
            console.error('Erro ao gerar PDF:', err);
            alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Exportar para PDF';
        });
    }
})

// Temporariamente aumenta o tamanho da fonte antes de exportar
function prepareForExport() {
    const originalStyles = {};
    const elements = resumePreview.querySelectorAll('*');
    
    elements.forEach(el => {
        originalStyles[el] = el.style.cssText;
        el.style.fontSize = '12pt';
        el.style.lineHeight = '1.5';
    });
    
    return originalStyles;
}

// Restaura os estilos após exportação
function restoreStyles(originalStyles) {
    Object.keys(originalStyles).forEach(el => {
        el.style.cssText = originalStyles[el];
    });
}

// Usar formato retrato ou paisagem conforme necessário
const orientation = resumePreview.scrollHeight > 1500 ? 'l' : 'p';
const doc = new jsPDF(orientation, 'pt', 'a4');