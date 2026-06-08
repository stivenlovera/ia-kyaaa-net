const abc = (): string[] => {
    return [
        "123",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "Ñ",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "#"
    ]

}

interface IGetAbcProps {
    name: string
    data: {
        slug: string[]
        name: string[]
        total: number[]
    }
}
export const getAbc = ({ name, slug, total }: { name: string[], slug: string[], total: number[] }): IGetAbcProps[] => {
    const result: IGetAbcProps[] = [];
    abc().map((abc, index) => {
        result.push({
            name: abc,
            data: {
                slug: [],
                name: [],
                total: []
            }
        })
        name.filter((name, i) => {
            if (name.toLocaleLowerCase().startsWith(abc.toLocaleLowerCase())) {
                result[index].data.name.push(name);
                result[index].data.slug.push(slug[i]);
                result[index].data.total.push(total[i]);
                return {
                    name: name,
                    slug: slug[i],
                    total: total[i],
                }
            }
        });
    })
    return result
}