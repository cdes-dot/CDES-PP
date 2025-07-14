import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { ReactNode } from 'react'

export default function NewsSection({ news, title, subtitle }: { news: any[], title: string, subtitle: string }) {
    return (
        <section className="bg-background py-16 dark:bg-transparent h-auto">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl news-title">
                        {title}
                    </h2>
                    <h3 className='text-balance text-lg font-medium'>
                        {subtitle}
                    </h3>
                </div>
                <Card className="max-h-auto @min-4xl:max-w-full @min-4xl:grid-cols-3 @min-4xl:divide-x @min-4xl:divide-y-0 mx-auto mt-8 grid max-w-sm divide-y overflow-hidden shadow-zinc-950/5 *:text-center md:mt-16">
                    <>
                        {
                            news.map((item, index) => (
                                <div className="group shadow-zinc-950/5" key={item.documentId}>
                                    <CardHeader className="pb-1">
                                        <h3 className="mt-4 min-h-[141.5px] font-medium line-clamp-5 text-left news-heading">
                                            <a
                                                href="/noticias/1"
                                                className="hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {item.Titulo}
                                            </a>
                                        </h3>
                                    </CardHeader>

                                    <CardContent>

                                        {item.Content[0].children.map((item: any) => (
                                            <p className="text-sm text-ellipsis overflow-hidden line-clamp-5 text-left my-2 news-content">
                                                {item.text}
                                            </p>
                                        ))}

                                        <div className="mt-4">
                                            <a
                                                href={`/noticias/${item.documentId}`}
                                                className="text-primary hover:text-primary/80 text-sm font-medium transition-colors cursor-pointer"
                                            >
                                                Leer más →
                                            </a>
                                        </div>
                                    </CardContent>
                                </div>
                            ))
                        }
                    </>
                </Card>

            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
        />
        <div
            aria-hidden
            className="bg-radial to-background absolute inset-0 from-transparent to-75%"
        />
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)