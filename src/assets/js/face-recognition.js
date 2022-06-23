
function recognition(responsible, disciplineName, persons, data, initialTime, finalTime) {

    const cam = document.getElementById('cam');
    var responsavel = document.getElementById('responsavel');
    var disciplina = document.getElementById('disciplina');

    var students = [];

    const startVideo = () => {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                if (Array.isArray(devices)) {
                    devices.forEach(device => {
                        if (device.kind === 'videoinput') {
                            navigator.getUserMedia(
                                {
                                    video: true
                                },
                                stream => cam.srcObject = stream,
                                error => console.error(error)
                            )
                        }
                    })
                }
            })
    }

    const loadPersons = () => {
        return Promise.all(persons.map(async label => {
            const descriptions = []
            for (let i = 0; i <= 4; i++) {
                const img = await faceapi.fetchImage(`https://firebasestorage.googleapis.com/v0/b/facepresencemarker.appspot.com/o/${label}%2F${i}?alt=media`);
                //const img = await faceapi.fetchImage(`/assets/face-api/labels/${label}/${i}.jpg`)
                const detections = await faceapi
                    .detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        }))
    }

    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/assets/face-api/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/assets/face-api/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/assets/face-api/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/assets/face-api/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/assets/face-api/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/face-api/models'),
    ]).then(startVideo)

    cam.addEventListener('play', async () => {
        canvas = faceapi.createCanvasFromMedia(cam)
        const canvasSize = {
            width: cam.width,
            height: cam.height
        }
        const persons = await loadPersons()
        canvas.style.top = "-20px";
        canvas.style.left = "270px";
        canvas.style.position = "absolute";
        faceapi.matchDimensions(canvas, canvasSize)
        document.body.appendChild(canvas)
        setInterval(async () => {
            const detections = await faceapi
                .detectAllFaces(
                    cam,
                    new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceExpressions()
                .withAgeAndGender()
                .withFaceDescriptors()
            const resizedDetections = faceapi.resizeResults(detections, canvasSize)
            const faceMatcher = new faceapi.FaceMatcher(persons, 0.6)
            const results = resizedDetections.map(d =>
                faceMatcher.findBestMatch(d.descriptor)
            )
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            /*faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            resizedDetections.forEach(detection => {
                const { age, gender, genderProbability } = detection
                /*new faceapi.draw.DrawTextField([
                    `${parseInt(age, 10)} years`,
                    `${gender} (${parseInt(genderProbability * 100, 10)})`
                ], detection.detection.box.topRight).draw(canvas)
            })*/
            results.forEach((result, index) => {
                const box = resizedDetections[index].detection.box
                const { label, distance } = result
                persons.map((x) => {
                    if (x.label === result.label) {
                        if (!students.includes(x.label)) {
                            students.push(x.label);
                        }
                    }
                })

                document.getElementById('alunos').value = students;
                document.getElementById('responsavel').value = responsible;
                document.getElementById('disciplina').value = disciplineName;
                document.getElementById('data').value = data;
                document.getElementById('horaInicio').value = initialTime;
                document.getElementById('horaFim').value = finalTime;
                document.getElementById('button').click();

                new faceapi.draw.DrawTextField([
                    `ID: ${label} (${parseInt(distance * 100, 10)})`
                ], box.bottomRight).draw(canvas)
            })
        }, 100)
    })
}


