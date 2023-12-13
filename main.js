const {createApp, ref, onMounted, watch, reactive  } = Vue
        const { createVuetify } = Vuetify

        const vuetify = createVuetify();
        const app = createApp({
            template: '#app-template',
            setup(){
                const singleImgSizeOpject = ref('');
                const selectedFileURL = ref(null);
                const selectedTarget = ref(null);
                const neuColor = ref('');
                const neuColorfull = ref('');
                const neuColorMaske = ref('');
                const imgOption = ref('')
                const state = reactive({
                    changeImageSizeCalled: false,
                });
                const imgSizeOptions  = ([
                    {
                        id: 1,
                        name: 'default',
                        value: {Width: 250, Height: 250},
                        safezone: false,
                        clicked: false
                    },
                    {
                        id: 2,
                        name: 'favicon.ico',
                        value: {Width: 32, Height: 32},
                        safezone: false,
                        clicked: false
                    },
                    {
                        id: 3,
                        name: 'Web-PNG 192px',
                        value: {Width: 192, Height: 192},
                        safezone: true,
                        clicked: false
                    },
                    {
                        id: 4,
                        name: 'Web-PNG 512px',
                        value: {Width: 512, Height: 512},
                        safezone: true,
                        clicked: false
                    },
                    {
                        id: 5,
                        name: 'Apple-Touch ',
                        value: {Width: 180, Height: 180},
                        safezone: true,
                        clicked: false
                    },
                    {
                        id: 6,
                        name: 'Microsoft',
                        value: {Width: 150, Height: 150},
                        safezone: true,
                        
                        clicked: false
                    },
                    {
                        id: 7,
                        name: 'Safari Pinned (Grayscale)',
                        value: {Width: 'grayscale(100%)', Height: ''},
                        safezone: false,
                        clicked: false
                    },
                ]);
                const widthSize = ref(250);
                const heightSize = ref(250);
                const GrayscaleColor = ref('')
                const ctxGlobal = ref('')

                const selectedOption = ref(imgSizeOptions[0].value);
                
                const drawBackground = (ctx, width, height, color) => {
                    if (color !== '') {
                        ctx.fillStyle = color;
                        ctx.fillRect(0, 0, width, height);
                        console.log('Background color applied: ' + color);
                    }
                };

                const drawSafeZone = (ctx, width, height) => {
                    const safezoneRadius = Math.min(width, height) * (4 / 5) / 2; // 4/5 safezone
                
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, safezoneRadius, 0, 2 * Math.PI);
                    ctx.fill();
                
                    console.log('Safe Zone applied');
                };

                // Es ist nicht zu 100% richtig ich muss daran wieder arbeiten
                const convertImageWithBackgroundAndMask = async (selectedFile, backgroundColor, maskColor, widthSize, heightSize) => {
                    return new Promise(async (resolve, reject) => {
                        const selFile = selectedFile;
                        if (!selFile) {
                            reject('Ungültige Datei');
                            return;
                        };
                        const reader = new FileReader();
                        reader.onload = async  (e) => {
                            try {
                                const img = new Image();
                                img.onload = async  () => {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    ctxGlobal.value = ctx;
                                    canvas.width = widthSize;
                                    canvas.height = heightSize;
                                    
                                    console.log('widthSize' + widthSize)
                                    console.log( 'heightSize' + heightSize)
                                    
                                    if(singleImgSizeOpject.value.safezone !== undefined) {
                                        // Zeichne die Safe Zone
                                        if(singleImgSizeOpject.value.safezone) {
                                            // drawSafeZone(ctx, canvas.width, canvas.height);
                                            const safezoneRadius = Math.min(canvas.width, canvas.height) * (4 / 5) / 2; // 4/5 safezone
                                            ctx.beginPath();
                                            ctx.arc(canvas.width / 2, canvas.height / 2, safezoneRadius, 0, 2 * Math.PI);
                                            if(maskColor !== '') {
                                                ctx.fillStyle = maskColor;
                                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                            }
                                            ctx.fill();
                                            console.log('safezone is applied')
                                            
                                        } 
                                        // Schneide den Canvas-Bereich auf die Safe Zone aus
                                        ctx.globalCompositeOperation = 'source-in'
                                    }
                                    // Es ist nicht zu 100% richtig ich muss daran wieder arbeiten
                                    // Zeichne den Hintergrund
                                    if(backgroundColor !== '' ) {
                                        // drawBackground(ctx, canvas.width, canvas.height, backgroundColor);
                                        // console.log('backgroundColor is mead')
                                        // ctx.globalCompositeOperation = 'source-over';
                                        ctx.fillStyle = backgroundColor;
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                        console.log('Background color applied: ' + backgroundColor);
                                    } 
                                    
                                    // Zeichne das Bild innerhalb der Safe Zone
                                    ctx.drawImage(img, 0, 0, widthSize, heightSize);

                                    // Setze den Blend-Modus zurück
                                    ctx.globalCompositeOperation = 'source-over';
                                    
                                    // Konvertiere das Canvas-Bild zu Base64
                                    const convertedImageURL = canvas.toDataURL('image/*');
                                    selectedFileURL.value = convertedImageURL; // new
                                    resolve(convertedImageURL);
                                };
                                img.src = e.target.result;
                                selectedFileURL.value = e.target.result; // new
                            } catch (error) {
                                reject('Fehler beim Verarbeiten des Bildes: ' + error.message);
                            }
                        };
                        reader.onerror = () => {
                            reject('Fehler beim Lesen der Datei');
                        };
                        reader.readAsDataURL(selFile);
                    });
                };   

                //Um das Icon zu zeigen
                const onFileSelected = async (event) => {
                    
                    if(selectedTarget.value === null){
                        selectedTarget.value = event;
                    }

                    const selectedFile = event.target.files[0];
                    if (selectedFile) {
                        // Konvertiere das Bild in die gewünschte Größe
                        await convertImageWithBackgroundAndMask(selectedFile, neuColorfull.value, neuColorMaske.value, widthSize.value, heightSize.value);
                        
                        
                    }
                };

                const saveImageLocallyInBrowser = async (dataURL, fileName) => {
                    
                    // console.log(selectedTarget.value);
                    // if() {
                    //     await onFileSelected(selectedTarget.value);
                    //     console.log('saveImageLocallyInBrowser'+ neuColorfull.value)
                    //     console.log('saveImageLocallyInBrowser'+ neuColorMaske.value)
                    // }
                        // const convertedDataURL = await convertImageWithBackgroundAndMask(selectedTarget.value.target.files[0], neuColorfull.value, neuColorMaske.value, widthSize.value, heightSize.value);
                    // Erstellung eines Download-Links
                    const link = document.createElement('a');
                    link.href = selectedFileURL.value;
                    link.download = fileName;
                    link.click();
                    // window.location.reload();
                };

                const saveImageToLocalStorage = (dataURL) => {
                    // Speichere das Bild in der Local Storage
                    localStorage.setItem('konvertiertesBild', dataURL);
                };
                
                const changeImageSize = async (sizeOpject) => {
                    // Speicherung des ausgewähltes Objektes local
                    singleImgSizeOpject.value = sizeOpject
                    // await onFileSelected(selectedTarget.value)
                
                    if(selectedFileURL.value) {
                        if(sizeOpject.value.Height === sizeOpject.value.Width){
                            GrayscaleColor.value = ''
                            widthSize.value = sizeOpject.value.Width
                            heightSize.value = sizeOpject.value.Height
                        }
                        else {
                            GrayscaleColor.value = sizeOpject.value.Width
                        }
                        await onFileSelected(selectedTarget.value)
                        // changeImage Size Überwachung
                        state.changeImageSizeCalled = !state.changeImageSizeCalled;
                        
                    }
                    
                };    

                // wenn changeImageSize aufgerufen wurde führt backgroundColorChange() aus
                watch(() => state.changeImageSizeCalled, () => {
                    console.log('changeImageSize wurde aufgerufen');
                    // um die Farbe zu wechseln zwichen neuColorMaske and neuColorfull
                    backgroundColorChange()
                });

                const backgroundColorChange = async () => {
                    // changeImage Size Überwachung
                    if(selectedFileURL.value) {
                        if(singleImgSizeOpject.value.safezone && neuColor.value !== '' || GrayscaleColor.value) {
                            console.log('singleImgSizeOpject neuColorneuColorneuColor')
                            neuColorfull.value = '';
                            neuColorMaske.value = neuColor.value;
                            
                        } 
                        // else if (GrayscaleColor.value && neuColor.value !== ''){
                        //     neuColorfull.value = '';
                        //     neuColorMaske.value = neuColor.value;

                        // } 
                        else if (neuColor.value === '') {
                            neuColorfull.value = '';
                            neuColorMaske.value = '';
                        }
                        else{
                            neuColorfull.value = neuColor.value ;
                            neuColorMaske.value = neuColor.value ;
                        }
                    }
                };

                return {selectedOption, widthSize,GrayscaleColor, heightSize,neuColorMaske, neuColorfull, neuColor, backgroundColorChange, imgSizeOptions, imgOption, selectedFileURL, onFileSelected, convertImageWithBackgroundAndMask, saveImageLocallyInBrowser, changeImageSize}
            }
        }).use(vuetify).mount('#app')