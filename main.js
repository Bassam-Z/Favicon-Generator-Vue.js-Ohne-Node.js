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
                        name: 'none',
                        value: {Width: 250, Height: 250},
                        safezone: true,
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

                // console.log(widthSize.value);
                // console.log(widthSize.value);

                // const selectedOption = ref(imgSizeOptions[0].value);
                
                // Es ist nicht zu 100% richtig ich muss daran wieder arbeiten
                const convertImageWithBackgroundAndMask = (selectedFile, backgroundColor, maskColor, widthSize, heightSize) => {
                    return new Promise((resolve) => {
                        const selFile = selectedFile;
                        if (!selFile) {
                            resolve('Ungültige Datei');
                            return;
                        };
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const img = new Image();
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = widthSize;
                                canvas.height = heightSize;
                                
                                console.log('widthSize' + widthSize)
                                console.log( 'heightSize' + heightSize)
                                
                                if(singleImgSizeOpject.value.safezone !== undefined) {

                                    // Es ist nicht zu 100% richtig ich muss daran wieder arbeiten
                                    if(neuColor.value !== '' ) {
                                        ctx.fillStyle = backgroundColor;
                                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                                        console.log( 'neuColor.value ist: ' + neuColor.value)
                                    } 
                                     // Es ist nicht zu 100% richtig ich muss daran wieder arbeiten
                                    // if(widthSize !== 250 && neuColor.value !== '') {
                                    //     ctx.fillStyle = backgroundColor;
                                    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
                                    //     console.log( 'backgroundColor ist: ' + backgroundColor)
                                    // } 
                                    
                                    // Zeichne die Safe Zone
                                    else if( singleImgSizeOpject.value.safezone) {
                                        console.log('0123')
                                        const safezoneRadius = Math.min(canvas.width, canvas.height) * (4 / 5) / 2; // 4/5 safezone
                                        ctx.beginPath();
                                        ctx.arc(canvas.width / 2, canvas.height / 2, safezoneRadius, 0, 2 * Math.PI);
                                        ctx.fill();
    
                                        // Schneide den Canvas-Bereich auf die Safe Zone aus
                                        ctx.globalCompositeOperation = 'source-in'
                                    }
                                } 
                                // Zeichne den Hintergrund

                                // Zeichne das Bild innerhalb der Safe Zone
                                ctx.drawImage(img, 0, 0, widthSize, heightSize);
                                
                                // Setze den Blend-Modus zurück
                                ctx.globalCompositeOperation = 'source-over';

                                // Konvertiere das Canvas-Bild zu Base64
                                const convertedImageURL = canvas.toDataURL('image/*');
                                resolve(convertedImageURL);
                            };
                            img.src = e.target.result;
                        };
                        
                        reader.onerror = () => {
                        resolve('Fehler beim Lesen der Datei');
                        };

                        reader.readAsDataURL(selFile);
                    });
                };   

                //Um das Icon zu zeigen
                const onFileSelected = async (event) => {
                    
                    if(selectedTarget.value == null){
                        selectedTarget.value = event;
                        console.log(selectedTarget.value + '5001')
                        // console.log(selectedTarget.value + '2')
                    }

                    const selectedFile = event.target.files[0];
                    // console.log(selectedFile + 'selectedFile33333333333');
                    if (selectedFile) {
                        // Bild in Base64 konvertieren
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            selectedFileURL.value = e.target.result;
                            // console.log(selectedFileURL.value);
                            // console.log(widthSize.value + 'onFileSelected')
                            // console.log(heightSize.value + "onFileSelected")
                            // Konvertiere das Bild in die gewünschte Größe
                            const convertedImageURL = await convertImageWithBackgroundAndMask(selectedFile, neuColorfull.value, neuColorMaske.value, widthSize.value, heightSize.value);
                            // die konvertierte URL für das Bild im Canvas
                            selectedFileURL.value = convertedImageURL;
                        };
                        reader.readAsDataURL(selectedFile);
                        
                    }
                };

                const saveImageLocallyInBrowser = async (dataURL, fileName) => {
                    
                    // console.log(selectedTarget.value);
                    await onFileSelected(selectedTarget.value);
                    console.log('saveImageLocallyInBrowser'+ neuColorfull.value)
                    console.log('saveImageLocallyInBrowser'+ neuColorMaske.value)
                    const convertedDataURL = await convertImageWithBackgroundAndMask(selectedTarget.value.target.files[0], neuColorfull.value, neuColorMaske.value, widthSize.value, heightSize.value);
                    // Erstellung eines Download-Links
                    const link = document.createElement('a');
                    link.href = convertedDataURL;
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
                    console.log(singleImgSizeOpject.value.name + 'changeImageSize')
                        console.log('changeImageSize selectedTarget' + selectedTarget.value)
                        await onFileSelected(selectedTarget.value)
                    
                        if(selectedFileURL.value) {
                            if(sizeOpject.value.Height === sizeOpject.value.Width){
                                GrayscaleColor.value = ''
                                // console.log(sizeOpject.value.Width + 'changeImageSize')
                            // console.log(sizeOpject.value.Height + 'changeImageSize')
                            widthSize.value = sizeOpject.value.Width
                            heightSize.value = sizeOpject.value.Height
                        }
                        else {
                            // widthSize.value = ''
                            // heightSize.value = ''
                            GrayscaleColor.value = sizeOpject.value.Width
                        }
                        await onFileSelected(selectedTarget.value)
                        // changeImage Size Überwachung
                        state.changeImageSizeCalled = !state.changeImageSizeCalled;
                        console.log(widthSize.value)
                        console.log(heightSize.value)

                    }
                    
                };    

                // wenn changeImageSize aufgerufen wurde führt backgroundColorChange() aus
                watch(() => state.changeImageSizeCalled, () => {
                    console.log('changeImageSize wurde aufgerufen');
                    // um die Farbe zu wechseln zwichen neuColorMaske and neuColorfull
                    backgroundColorChange()
                });

                const backgroundColorChange = () => {
                    // changeImage Size Überwachung
                    if(selectedFileURL.value) {
                        if(widthSize.value === 250 ) {
                            // neuColorMaske.value =  'transparent';
                            // neuColorfull.value = 'transparent';
                            neuColorfull.value = neuColor.value;
                            neuColorMaske.value = neuColorfull.value;
                            
                        } else if (GrayscaleColor.value){
                            neuColorfull.value = neuColor.value;
                            neuColorMaske.value = neuColorfull.value;

                        } else if (neuColor.value === '') {
                            neuColorfull.value = '';
                            neuColorMaske.value = '';

                        }else if (neuColor.value !== '' && widthSize.value !== 250){
                            neuColorfull.value = neuColor.value;
                            neuColorMaske.value = neuColor.value;
                        }
                        else{
                            // neuColorfull.value = neuColor.value;
                            neuColorfull.value = neuColor.value ;
                            neuColorMaske.value = neuColorfull.value ;
                        }
                    }
                };

                return {widthSize,GrayscaleColor, heightSize,neuColorMaske, neuColorfull, neuColor, backgroundColorChange, imgSizeOptions, imgOption, selectedFileURL, onFileSelected, convertImageWithBackgroundAndMask, saveImageLocallyInBrowser, changeImageSize}
            }
        }).use(vuetify).mount('#app')