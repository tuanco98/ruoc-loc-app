const getPaginationStage = (page: number, pageSize: number) => {
    return [
        {
            $limit: (page + 1) * pageSize
        },
        {
            $skip: page * pageSize
        }
    ]
}

const getTotalStage = () => ({
    $count: "total"
})

export {
    getPaginationStage,
    getTotalStage
}