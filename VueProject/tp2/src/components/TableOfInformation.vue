<template>
  <div>
    <br>
    <br>
    <h1>{{Text}}</h1>
    <v-data-table
      :headers="headers"
      :items="shows"
      item-key="name"
      class="elevation-1"
      :search="search"
      :custom-filter="filterOnlyCapsText"
    >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn rounded color="red" dark @click="editItem(item)"
      >Edit</v-btn>
    </template>
      <template v-slot:top>
        <v-text-field v-model="search" label="Search (LOWER CASE ONLY)" class="mx-4"></v-text-field>
      </template>
      <template>
        <tr>
          <td></td>
          <td colspan="4"></td>
        </tr>
      </template>
    </v-data-table>
    <edit-show-form v-model="dialog" :editedShow="editedShow" :editedSelections="editedSelections"/>
  </div>
</template>

<script>
import EditShowForm from './EditShowForm.vue';
export default {
  components: { EditShowForm },
  name: "table_of_contents",
  props: {
    Text: String,
  },
  data: () => ({
    search: "",
    shows: [],
    dialog: false,
    editedShowIndex: -1,
    editedShow: null,
    editedSelections: {
      selectionLocation: [],
      selectionRating: [],
      selectionType: [],
      selectionSpotlight: [],
    },

  }),
  created() {
    this.getShows();
  },
  computed: {
    headers() {
      return [
        {
          text: "Show Name",
          align: "start",
          sortable: false,
          value: "showName",
        },
        {
          text: "Is Spotlight?",
          value: "isSpotlight",
        },
        { text: "Show Date", value: "date" },
        { text: "Time", value: "showTime"},
        { text: "Type", value: "type" },
        { text: "Rating", value: "rating" },
        { text: "Location", value: "building" },
        { text: "Price (€)", value: "price" },
        { text: "Available Tickets", value: "availableTickets" },
        { text: 'Actions', value: 'actions', sortable: false },
      ];
    },
    allShows() {
      return this.shows;
    },
  },
  methods: {
    filterOnlyCapsText(value, search, item) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleLowerCase().indexOf(search) !== -1
      );
    },
    //Uses API to get all shows on the database
    getShows() {
      this.$axios
        .get("http://localhost:3000/api/tp2/shows/no_group")
        .then((response) => response)
        .then((data) => {
          console.log(data.data)
          this.shows = data.data.map((element) => {
            var temp = element;

            if (temp.isSpotlight === 1) {
              temp.isSpotlight = "Yes";
            } else {
              temp.isSpotlight = "No";
            }
            return temp;
          });
          console.log(this.shows);
        })
        .catch((error) => console.log(error));
    },
    editItem (item) {
        this.editedShowIndex= this.shows.indexOf(item)
        this.editedShow = Object.assign({}, item)

        this.editedSelections.selectionLocation = item.building
        this.editedSelections.selectionRating = item.rating
        this.editedSelections.selectionType = item.type
        this.editedSelections.selectionSpotlight = item.isSpotlight
        
        console.log(this.editedShow)
        console.log(this.editedShow)
        this.dialog = true
      },
  },
};
</script>

<style scoped>
.v-data-table {
  margin: 5%;
}

</style>