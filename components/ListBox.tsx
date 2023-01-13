import capitalize from "../lib/capitalize"

type ListBoxTypes = {
  title: string
}

function ListBox({ title }: ListBoxTypes) {
  return (
    <div className="h-48 flex flex-col-reverse text-center border border-solid border-gray cursor-pointer bg-white">
      <h4 className="py-2 border-t border-solid border-gray">
        {capitalize(title)}
      </h4>
    </div>
  )
}

export default ListBox
