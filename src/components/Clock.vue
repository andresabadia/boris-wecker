<template>
    <div id="clock">
        <h1 class="display-4">
            {{ h | time }}:{{ m | time }}:{{ s | time }}
        </h1>
    </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            today:null,
            h:0,
            m:0,
            s:0
        }
    },
    created(){
        this.startTime()    
    },
    methods:{
        startTime(){
            this.today = new Date()
            this.h = this.today.getHours()
            this.m = this.today.getMinutes()
            this.s = this.today.getSeconds()
            setTimeout(this.startTime, 500)         
        }
    },
    filters: {
        time:(value)=>{
            if (value < 10) {
                value = "0" + value
            }
            return value
        }
    }
}
</script>
<style>
#clock{    
    font-family: 'B612 Mono', monospace;
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 20px 50px;
    text-shadow: 0px 0px 30px white;
}
</style>
