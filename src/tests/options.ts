export default {
    props: {
        name: String,
        id: [Number, String],
        msg: { type: String, required: true },
        metadata: null
    },
    data() {
        return {
            counter: 0
        }
    },
    mounted() {
        this.name // type: string | undefined
        this.id // type: number | string | undefined
        this.msg // type: string
        this.metadata // type: any
    },
    methods: {
        incrementCounter(): void {
            this.counter++;
        }
    }
}
