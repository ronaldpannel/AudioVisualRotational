/**@type{HTMLCanvasElement} */

function main(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });

    class Bar{
        constructor(x, y, width, height, color,index){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.index = index;
        }
        update(micInput){
            const sound = micInput * 1000
            // this.height =  micInput * 1000
            if(sound > this.height){
                this.height = sound
            } else{
                this.height -= this.height * 0.03
            }
        }
        draw(context, volume){
            context.strokeStyle = this.color
            context.save()
            
            context.translate(0, 0)
            context.rotate(this.index * 0.02)
            context.scale(1 + volume * 0.5, 1 + volume * 0.5)
            context.beginPath()
            // context.moveTo(0,0)
            // context.moveTo(this.x, this.y)
            // context.lineTo(this.y, this.height)
            context.bezierCurveTo(0, 0, this.height, this.height, this.x, this.y * 2)

            context.stroke()
            // context.strokeRect(this.y + this.index * 1.5, this.height, this.height / 3, this.height)
            context.beginPath()
            context.arc(this.x + this.index * 1.5, this.y, this.height * 0.5, 0, Math.PI * 2)
            context.stroke()
            context.restore()
        }
    }
    const fftSize = 512
    const microphone = new Microphone(fftSize)
    let bars = []
    let barWidth = canvas.width / (fftSize/2)
    function createBars(){
        for(let i = 0; i < (fftSize / 2); i ++){
            let color = 'hsl(' + i * 2 + ', 100%, 50%)'
            //  bars.push(new Bar(i * barWidth,canvas.height / 2, 1, 20, color, i))
            bars.push(new Bar(0, i * 1, 5, 50, color, i))
        }
    }
    createBars()
    //console.log(bars)
    let angle = 0
    let softVolume = 0

    function animate(){
        if(microphone.initialized){
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        // Generate Audio samples from microphone
        const samples = microphone.getSamples()
        const volume = microphone.getVolume()
        //animate bars based on sample
        angle += 0.001 + volume * 0.1
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate(angle)
        bars.forEach(function(bar, i){
            bar.update(samples[i])
            bar.draw(ctx, volume)
        })
        ctx.restore()
        // softVolume = softVolume * 0.9 + volume * 0.1
        }
        
            requestAnimationFrame(animate)
        }
        animate()







} //main function end

