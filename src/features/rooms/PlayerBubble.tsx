function PlayerBubble({
  username,
  avatar,
  isTurn,
  cardCount,
  className,
  isMe
}: {
  username?: string
  avatar?: string
  className?: string
  isTurn?: boolean
  cardCount?: number
  isMe?: boolean
}) {
  // console.log(`player bubble render`)
  return (
    <div className={`${className} z-50 flex flex-col items-center`}>
      <div className="relative">
        <img
          src={avatar}
          className={`h-14 w-14 rounded-full object-cover ${isTurn ? 'ring-10 ring-green-500' : 'ring-10 ring-transparent'}`}
          alt={`${username}'s avatar`}
        />

        <div className="bg-card-bg absolute bottom-0 left-1/2 flex h-6 w-6 -translate-x-1/2 translate-y-1/2 transform items-center justify-center rounded-md text-sm font-bold shadow-lg">
          {cardCount}
        </div>
      </div>

      <p
        className={`mt-4 text-sm font-semibold uppercase ${isMe ? 'text-slate-950' : 'text-white'}`}
      >
        {username}
      </p>
    </div>
  )
}

export default PlayerBubble
