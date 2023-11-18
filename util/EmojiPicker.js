const EMOJIS =
    [
        '✨',
        '🔥',
        '🍃',
        '🍂',
        '🥳',
        '😎',
        '😇',
        '🤓',
        '😁',
        '😀',
        '🤩',
        '🙃',
        '🤠',
        '😼',
        '😈',
        '🎁',
        '🎈',
        '🧸',
        '🎉',
        '🎊',
        '💯'
    ]

function PickRandomEmojis(number) {
    const emojis = new Set()
    while (emojis.size < number){
        emojis.add(EMOJIS[Math.floor((Math.random() * EMOJIS.length - 1) + 1)])
    }
    return emojis
}

module.exports = {
    PickRandomEmojis
}