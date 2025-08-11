import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"

const Resumen = ({ length, instituciones }: { length: number, instituciones: number }) => {
    return (
        <div className="mt-16 bg-background rounded-lg border shadow-sm p-8">
            <div className="text-center space-y-6">
                <h3 className="text-2xl font-semibold font-playfair">
                    Impacto en el Desarrollo de Santiago
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{length}</div>
                        <div className="text-sm text-muted-foreground">Proyectos Estratégicos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">1.3M+</div>
                        <div className="text-sm text-muted-foreground">Ciudadanos Beneficiados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">RD$ 11B</div>
                        <div className="text-sm text-muted-foreground">Inversión Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{instituciones}</div>
                        <div className="text-sm text-muted-foreground">Instituciones Aliadas</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <a href='/biblioteca-de-proyectos'>
                        <Button size="lg">
                            Ver Todos los Proyectos
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </a>
                    <Button variant="outline" size="lg">
                        Únete como Aliado Estratégico
                    </Button>
                </div>
            </div>
        </div>
    )
}

export { Resumen }