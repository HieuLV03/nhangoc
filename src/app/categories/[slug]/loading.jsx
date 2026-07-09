export default function Loading(){

  return (
    <div className="categoryLoading">

      <div className="loadingTitle"></div>

      <div className="loadingGrid">

        {Array.from({length:6}).map((_,i)=>(
          <div 
            key={i}
            className="loadingCard"
          >
          </div>
        ))}

      </div>

    </div>
  );

}