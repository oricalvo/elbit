export class ContactActions {
  filter(searchStr: string) {
    return {
      type: "FILTER",
      searchStr,
    }
  }
}
