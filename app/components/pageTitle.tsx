interface PageTitleProps {
    badge?: string
    badgeColor?: string
    title: string
}

export default function PageTitle({
                                      badge,
                                      badgeColor = "bg-gray-100 text-gray-700",
                                      title,
                                  }: PageTitleProps) {
    return (
        <div className="text-center mb-10">
            {badge && (
                <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
            {badge}
          </span>
                </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold">
                {title}
            </h1>
        </div>
    )
}