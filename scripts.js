//edited from: https://github.com/radian628/desmoscript/blob/main/examples/suzanne/3dTest.mjs

//specifically for .ply files that have been triangulated and are in ASCII

  const vertices_start_line = 15; //you gotta put this in manually
  const vertices_end_line = 234;
  const file_path = "./dam_z_up_tri_colored.ply"

  

  function getPoint(src) { 
    const all_lines = src.split("\n")
    const line = all_lines[16].split(" ")
    let first_point = [];
    first_point.push(line[0]) //gets the first x and y
    first_point.push(line[1])
    return first_point
  }

  function getThemColors(src, index) {
    const all_lines = src.split("\n")
    let clrs = []
    for (let i = vertices_start_line - 1; i < vertices_end_line; i++) { //start at vert start, end at its end
      let noise = Math.round(Math.random() * 80)
      let line = all_lines[i].split(" ")
      clrs.push(parseInt(line[index + 3]) - noise) //so one function should get all the reds, which is the 4th number, then the blues, then the greens
    }
    return clrs
  }

  function getThemVertices(src, index) {
    const all_lines = src.split("\n")
    let verts = []
    for (let i = vertices_start_line - 1; i < vertices_end_line; i++) { //start at vert start, end at its end
      let line = all_lines[i].split(" ")
      verts.push(line[index]) //so one function should get all the first verts, then the next the second, then the next the third
    }
    return verts
  }

  function getThemIndices(src, index) {
    const all_lines = src.split("\n")
    let inds = []
    for (let i = vertices_end_line; i < all_lines.length - 1; i++) { // start at vert end, end at document end
      let line = all_lines[i].split(" ")
      inds.push(parseInt(line[index+1]) + 1) //gets the column of indices based on index, and then adds 1 since desmos is 1-indexed
                                            // and blender is 0-indexed, so it needs to convert
    }
    return inds
  }


  export default function ({ scope, addMacro }) {
    const dims = ["X", "Y", "Z"];
    const channels = ["R", "G", "B"]


    addMacro({ // just a test macro
      name: "plotPoint",
      fn: async (node, a) => {
        const file = await a.readStringFile(file_path);
        const point = getPoint(file);
        return a.parseExpr(`[${point.join(",")}]`);
      }
    });



    

    for (let i=0;i<3;i++) {


      addMacro({
        name: `getColors${channels[i]}`,
        fn: async (node, a) => {
          const file = await a.readStringFile(file_path)
          const colors = getThemColors(file, i)
          return a.parseExpr(`[${colors.join(",")}]`)
        }
      })

      addMacro({
        name:`getVertices${dims[i]}`,
        fn: async (node, a) => {
          const file = await a.readStringFile(file_path)
          const vertices = getThemVertices(file, i)
          return a.parseExpr(`[${vertices.join(",")}]`);
        }
      })

      addMacro({
        name:`getsIndices${i+1}`,
        fn: async (node, a) => {
          const file = await a.readStringFile(file_path)
          const indices = getThemIndices(file, i)
          return a.parseExpr(`[${indices.join(",")}]`);
        }
      })

    }
    



  }